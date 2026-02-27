# 术语表（Glossary）

本文件用于统一项目术语与口径，减少文档/代码/沟通中的歧义。

## 基础概念

- **MQTT Broker**：MQTT 消息代理服务。本项目使用 **Aedes** 作为 Broker（见 `docs/architecture.md`）。
- **Topic**：MQTT 的主题字符串。
  - 本项目约定：**Topic 不承载业务语义**，仅用于订阅过滤与来源标记；入库时需保留原始 topic（见 `docs/data-spec.md`、ADR-0005）。
- **Topic Pattern / Topic Filter**：MQTT 订阅使用的过滤表达式（支持 `+`、`#`）。
  - 例：`#`、`devices/+/telemetry`。
  - 本项目约定：pattern 由后台配置维护，不在代码中硬编码。

## 数据面（Data Plane）

- **数据面**：指“设备上报 → 采集/入库 → 查询/可视化”链路。
- **Payload**：设备上报的消息体内容。
  - 推荐为 JSON（UTF-8）；是否强制 JSON 以 `docs/data-spec.md` 为准。
- **deviceId**：设备唯一标识。
  - 本项目约定：**设备归属以 payload 内的 `deviceId` 为准**，不从 topic 推断（见 `docs/data-spec.md`、ADR-0004）。
- **ts**：事件时间戳（毫秒）。缺省时可由服务端接收时间补齐（具体以实现为准）。
- **type**：消息类型/用途（例如 `telemetry`/`status`/`event`），用于查询过滤与统计（可选但推荐）。
- **data**：业务数据对象（字段可演进）。
- **payload_raw**：入库保存的原始 payload（建议 JSONB），用于追溯与兼容演进。
- **ingested_at**：入库时间（服务端写入时间）。

## 控制面（Control Plane）

- **控制面**：指“客户端下发命令 → 后端管控 → MQTT 下行 → 设备执行/回执”的链路（见 `docs/control-spec.md`）。
- **命令（Command）**：一次对设备的控制操作（例如启动/停止/设置参数）。
- **commandId**：命令唯一标识（建议由服务端生成）。
- **requestId**：幂等请求标识（客户端生成），用于避免重复提交导致重复下发。
- **ttlMs**：命令有效期（超时后视为失败/不再执行，规则以实现为准）。
- **ack（回执）**：设备对命令的确认/结果回传，需能与 `commandId` 关联。
- **命令状态机**：命令从创建到完成的状态流转（例如 `queued → sent → acked → succeeded/failed/timeout`）。

## 服务与模块

- **api-service**：HTTP API 服务（TypeScript + Hono），负责后台配置、查询、下发命令入口、鉴权/授权/审计等。
- **mqtt-broker**：MQTT Broker 服务（Aedes），负责连接与发布订阅（不承载业务规则）。
- **ingest-worker**：采集入库服务，消费 MQTT 消息，校验 payload（必须含 `deviceId`），执行自动建表/入库。
- **admin-web**：Web 管理台（Vite + React + React Router + Zustand），只消费 `api-service` 的 HTTP API。

## 架构术语（Clean Architecture）

- **Entities（领域实体）**：最核心的业务概念与规则。
- **Use Cases（用例）**：业务流程编排（应用层）。
- **Ports（端口/接口）**：用例层依赖的抽象接口（例如 Repository、Publisher）。
- **Adapters（适配器）**：把外部输入/输出转换为用例输入/输出（HTTP/MQTT handler、DTO/Presenter 等）。
- **Frameworks & Drivers（框架/驱动）**：Hono、Aedes、数据库驱动、前端框架等外部依赖。

## 相关文档

- 数据规范：`docs/data-spec.md`
- 控制规范：`docs/control-spec.md`
- 架构约束：`docs/architecture.md`
- ADR：`docs/decisions/`

