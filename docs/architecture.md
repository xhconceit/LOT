# 架构与约束

本文件描述本项目采用的**清洁架构（Clean Architecture）**分层、模块边界与关键数据流，并以“从第一天就可拆分微服务”为目标，确保实现长期可维护、可测试、可演进。

## 1. 架构风格：清洁架构（必须）

### 1.1 分层（从内到外）

- **Entities（领域实体）**：核心业务概念与规则（设备、遥测点、入库记录、原始消息等）
- **Use Cases（应用用例）**：业务流程编排（接收消息→校验→建表/入库；查询历史→聚合→返回）
- **Interface Adapters（接口适配层）**：把外部输入/输出转换成用例的输入/输出（HTTP handler、MQTT handler、DTO/Presenter）
- **Frameworks & Drivers（框架/驱动/基础设施）**：Hono、Aedes、PostgreSQL、Vite（React）、日志、配置、第三方库等

### 1.2 依赖规则（必须遵守）

- **依赖只能从外向内**：Frameworks/Adapters → Use Cases → Entities
- **内层不得引用外层**：Entities/Use Cases 不能 import Web 框架、数据库驱动、MQTT SDK、UI 框架等
- **通过接口反转依赖**：Use Cases 依赖 `Repository`/`Port` 接口；具体实现放在 Infrastructure

## 2. 服务拆分（从第一天就可拆分微服务）

推荐最小拆分（可独立部署/扩缩容）：

- **`mqtt-broker`**：MQTT Broker（Aedes），负责连接/鉴权/发布订阅（不做业务）
- **`ingest-worker`**：订阅/接收消息，校验 payload（必须含 `deviceId`），写入 PostgreSQL（含自动建表）
- **`api-service`**：HTTP API（TypeScript + Hono），负责后台配置、设备列表、数据查询与聚合等
- **`admin-web`**：Web 管理台（Vite + React + React Router + Zustand，使用 shadcn/ui + Tailwind CSS）

> 约束：业务规则落在 `domain/application`，各服务只是“外层驱动 + 适配 + 基础设施实现”。

## 3. 模块边界（建议映射）

- **采集（MQTT Ingest）**：
  - Adapters：MQTT message handler（将消息转换为用例输入 DTO）
  - Use Case：`IngestTelemetry`（校验 payload、决定写入；Topic 不做语义解析，仅保留）
  - Infra：MQTT（Aedes）、连接管理、订阅配置
- **存储（DB Writer）**：
  - Use Case 依赖 `TelemetryRepository`、`TableProvisioner` 等接口
  - Infra：PostgreSQL 实现（自动建表、写入、索引）
- **查询（API）**：
  - Adapters：Hono route handler（将 HTTP 转为用例输入）
  - Use Case：`QueryTelemetry`、`ListDevices` 等
  - Infra：SQL 查询实现
- **展示（Web UI）**：
  - Presentation：Web 页面/组件（仅做展示与交互，调用 `api-service`）
  - UI/样式：shadcn/ui + Tailwind CSS（统一组件与设计语言）

## 4. 推荐目录结构（Monorepo + Clean Architecture）

> 目标：服务可拆分、内层可复用；各服务只替换外层驱动与适配。

建议：

```text
apps/
  mqtt-broker/       # Aedes broker（框架层）
  ingest-worker/     # 消息接入与入库（框架层）
  api-service/       # Hono HTTP API（框架层）
  admin-web/         # Web 管理台（框架层，shadcn/ui + Tailwind）
packages/
  domain/            # Entities + 值对象 + 领域服务（纯业务）
  application/       # Use Cases + Ports（接口定义）+ DTO
  shared/            # schema 校验、类型、工具（可选）
docs/
```

约定：

- `packages/domain`、`packages/application` **禁止**引用 Web/DB/MQTT/UI 等外层依赖
- `apps/*` **可以**引用驱动与 SDK，并实现 `packages/application` 中的 Ports

## 5. 关键数据流

```text
Devices → mqtt-broker(Aedes) → ingest-worker → PostgreSQL
                                     ↓
                               api-service(Hono) → admin-web
```

## 6. 架构要求（必须）

- **数据约定优先**：实现以 `docs/data-spec.md` 为准
- **模块解耦**：通过 Use Cases + Ports 解耦 MQTT、DB、API、UI
- **可观测性**：关键路径必须有日志/指标（开发环境详细，生产保留关键日志）
- **幂等与并发安全**：自动建表在并发设备上线时不得崩溃（需要锁或“建表存在即忽略”策略）

## 7. 非目标（暂不做）

- 多租户（Tenant）隔离
- 复杂权限体系（RBAC/ABAC）
- 完整告警编排系统

## 8. 后续补充

当你决定以下内容时，请同步写入 `docs/decisions/`：

- 自动建表策略（锁/DDL 并发、命名、索引）
- Schema 演进（JSONB vs 自动增列）
- API 形态（REST vs RPC、分页/聚合策略）

