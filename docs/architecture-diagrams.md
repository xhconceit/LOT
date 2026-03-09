# 架构图：分层边界 / 数据流 / 错误翻译流

本文件将 `docs/architecture.md` 的约束用图形化方式表达，便于团队讨论与代码评审时快速对齐。

## 1) 分层边界与依赖方向（严格模式）

```mermaid
flowchart LR
  %% 内层
  subgraph D["packages/domain（Entities / 领域层）"]
    D1["实体/值对象/领域规则\n纯业务、无框架依赖"]
  end

  subgraph A["packages/application（Use Cases / 用例层）"]
    A1["Use Cases（IngestTelemetry/QueryTelemetry/...）"]
    A2["Ports（Repository/Provisioner 接口）"]
  end

  %% 外层共享（严格模式下：仅外层使用）
  subgraph S["packages/shared（外层共享工具包）"]
    S1["schema/validator（parse/validate）"]
    S2["Result / I18nError / 通用类型"]
  end

  %% 最外层：服务
  subgraph Apps["apps/*（Frameworks + Adapters + Infra）"]
    subgraph Ingest["ingest-worker"]
      I1["adapters（MQTT handler）"]
      I2["infra（Pg*Repository / TableProvisioner）"]
      I3["drivers（mqtt/postgres）"]
    end

    subgraph Api["api-service"]
      H1["routes（Hono handlers）"]
      H2["middleware / server（Hono / node-server）"]
      H3["infra（SQL/ports 实现）"]
    end

    subgraph Broker["mqtt-broker"]
      B1["Aedes broker（仅驱动，不做业务）"]
    end

    subgraph Web["admin-web"]
      W1["UI（React）"]
    end
  end

  %% 依赖方向（只能从外向内）
  Apps --> A
  Apps --> D

  %% 用例层依赖领域层
  A --> D

  %% 严格边界：shared 只给 apps 用（domain/application 不 import shared）
  Apps --> S

  %% Ports 由外层实现（依赖反转）
  I2 -.implements.-> A2
  H3 -.implements.-> A2
```

### 依赖红线（严格模式）

```mermaid
flowchart TB
  X1["✅ apps/* 可以 import\n@lot/application / @lot/domain / @lot/shared / 框架驱动"] --> X2
  X2["✅ application 只能 import\n@lot/domain"] --> X3
  X3["✅ domain 不能 import\n任何 workspace 包"] --> X4
  X4["⛔ application/domain 禁止 import\n@lot/shared、hono、mqtt、postgres、Buffer、process.env 等"]
```

## 2) 关键数据流（业务链路）

```mermaid
flowchart LR
  Dev["设备/网关"] -- MQTT Publish --> Broker["mqtt-broker（Aedes）"]

  Broker -- 订阅/转发 --> IngestAdapter["ingest-worker/adapters\nMQTT handler"]
  IngestAdapter -- parse/validate --> Shared["@lot/shared\nparsePayload + I18nError"]
  IngestAdapter -- DTO --> UC["@lot/application\nIngestTelemetry UseCase"]

  UC -- Ports --> DevRepo["DeviceRepository（Port）"]
  UC -- Ports --> TblProv["TableProvisioner（Port）"]
  UC -- Ports --> TelRepo["TelemetryRepository（Port）"]

  DevRepo -. impl .-> PgDev["ingest-worker/infra\nPgDeviceRepository"]
  TblProv -. impl .-> PgTbl["ingest-worker/infra\nPgTableProvisioner"]
  TelRepo -. impl .-> PgTel["ingest-worker/infra\nPgTelemetryRepository"]

  PgDev --> PG[(PostgreSQL)]
  PgTbl --> PG
  PgTel --> PG

  Admin["admin-web（React）"] -- HTTP --> ApiRoute["api-service/routes\nHono handler"]
  ApiRoute -- DTO --> QueryUC["@lot/application\nQueryTelemetry/ListDevices UseCase"]
  QueryUC -- Ports --> QueryRepo["TelemetryRepository/DeviceRepository（Port）"]
  QueryRepo -. impl .-> ApiPg["api-service/infra\nSQL 实现"]
  ApiPg --> PG
  ApiRoute -- JSON --> Admin
```

## 3) 错误流 / 翻译流（code + key/params → t(key, params)）

### 3.1 统一错误契约（后端 → 多端）

```mermaid
flowchart LR
  %% 后端侧
  subgraph Backend["后端（apps/* + packages/*）"]
    V["校验/业务判断\n(shared schema / 路由层 / 用例前置校验)"]
    E["产生结构化错误\nI18nError / ApiError / 未知异常"]
    R["统一错误响应\n{ ok:false, error:{ code, key, params?, details? } }"]
  end

  %% 传输
  subgraph Wire["HTTP（仅传递结构化信息）"]
    J["JSON:\nerror.code\nerror.key\nerror.params\nerror.details?"]
  end

  %% 客户端侧
  subgraph Clients["客户端（admin-web / 小程序 / App）"]
    FE["拿到 error"]
    B["按 code 做逻辑分支\n401->登录\n403->无权限\n429->限流提示\n..."]
    T["按 key/params 做展示\ntext = t(key, params)\nkey 缺失 -> fallback（error.unknown）"]
    UI["展示可翻译文案\n@lot/i18n locales"]
  end

  V --> E --> R --> J --> FE --> B --> T --> UI
```

### 3.2 后端内部捕获/映射（以 api-service 为例）

```mermaid
flowchart TD
  subgraph Backend["后端（api-service）"]
    H["Hono handler / 业务逻辑"] --> Q{是否出错?}
    Q -- 否 --> OK["成功响应\n{ ok:true, data }"]
    Q -- 是 --> ERR["throw ApiError / throw unknown\n或 Result.err(I18nError)"]
    ERR --> MW["统一错误中间件\n捕获 + 记录日志"]
    MW --> MAP["映射为标准错误体\nstatus + { ok:false, error:{code,key,params?,details?} }"]
    MAP --> OUT["HTTP Response"]
  end
```

### 约束要点（与 ADR-0012 & API 契约对齐）

- 后端错误返回应优先使用可翻译信息：`error.key` + `error.params`（避免返回不可翻译的硬编码 `message`）。
- `error.code` 用于客户端**程序化分支**（跳登录/无权限/限流等）；`error.key/params` 用于**用户可见文案**（`t(key, params)`）。
- 客户端对未知 `key` 必须有降级：例如回退到 `error.unknown`，避免因为 key 拼写/版本不一致导致 UI 崩溃。

