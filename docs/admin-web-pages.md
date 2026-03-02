# admin-web 页面清单（UI 规格草案）

本文件把 `docs/requirements.md`、`docs/api-spec.md`、`docs/auth-spec.md`、`docs/control-spec.md` 中会落到 **Web 管理台（admin-web）** 的需求，整理为“要做的页面/界面清单 + 路由建议 + 基本交互与验收要点”。

> 约束回顾：
>
> - `admin-web` 只消费 `api-service` 的 HTTP API（见 `docs/architecture.md`）。
> - Topic **不承载语义**，UI 只做展示、筛选与追溯，不做解析推断（见 `docs/data-spec.md`）。
> - 控制链路必须经由 API，且要鉴权/授权/审计（见 `docs/control-spec.md`、`docs/auth-spec.md`）。

## 路由总表（建议）

> 说明：这是推荐的“信息架构”，不要求一次性全部实现。可按 Must → Should → Could 分迭代落地。

| 优先级 | 路由 | 页面 | 目的 |
| --- | --- | --- | --- |
| Must | `/login` | 登录 | 获取访问令牌/建立会话，进入后台 |
| Must | `/` | Dashboard 总览 | 最近数据、基础趋势、关键指标入口 |
| Must | `/config/topic-subscriptions` | Topic 订阅配置 | 维护 MQTT Topic Filter（pattern）订阅项（增删改查/启停） |
| Must | `/config/mqtt` | MQTT Broker 配置 | 配置 Broker 连接信息（需求存在于 `docs/requirements.md`） |
| Should | `/config/env` | 环境/连接检查 | 显示 API Base URL、健康检查、版本信息（便于排障） |
| Must | `/devices` | 设备列表 | 列出已发现设备，支持搜索/分页 |
| Must | `/devices/:deviceId` | 设备详情（概览） | 展示设备首次/最近上报时间、快捷入口 |
| Must | `/devices/:deviceId/telemetry` | 设备数据（趋势/列表） | 最近数据、时间范围查询、过滤（type/topic） |
| Should | `/devices/:deviceId/telemetry/aggregate` | 数据聚合统计 | 时间桶聚合、按 topic/type 维度统计（可并入 telemetry 页） |
| Must | `/devices/:deviceId/commands` | 设备控制 | 下发控制命令、查看状态与历史 |
| Should | `/commands/:commandId` | 命令详情 | 单条命令状态机、失败原因、重试入口（如需要） |
| Could | `/authz/device-access` | 授权管理 | 管理用户-设备关系与权限（read/control/config） |
| Could | `/audit/commands` | 审计日志 | 控制相关审计查询与导出（依赖后端实现） |
| Could | `/alerts` | 告警 | 阈值告警与通知（依赖后端实现） |
| Could | `/export` | 数据导出 | CSV/JSON 导出入口（依赖后端实现） |

## 导航结构（建议）

- **侧边栏**
  - Dashboard
  - 设备
    - 设备列表
  - 配置
    - Topic 订阅
    - MQTT Broker
  - （可选）审计 / 授权 / 告警
- **顶栏**
  - 当前环境/连接状态（API health）
  - 当前登录用户与退出

## 页面规格

以下按页面描述：目标、主要 UI、交互、依赖 API、状态与验收要点。

### 1) 登录（`/login`）【Must】

- **目标**
  - 管理员/运营人员登录后访问后台。
- **主要 UI**
  - 表单：账号/密码（或后续替换为 OIDC/OAuth）。
  - 提示：登录失败原因（按错误码映射到 i18n 文案）。
- **交互**
  - 提交后禁用按钮、显示加载态。
  - 登录成功后跳转到 `/`，并在全局状态保存 token（或 cookie 会话）。
- **依赖**
  - `docs/auth-spec.md` 建议：Bearer Token（Access/Refresh）。
  - `docs/api-spec.md` 当前未落地 auth 接口：实现时需补充 `POST /api/v1/auth/login`（或等价）。
- **验收要点**
  - 未登录访问受限路由会重定向到 `/login`。

### 2) Dashboard 总览（`/`）【Must】

- **目标**
  - 提供“系统概况 + 快速入口”：最近数据、基础趋势、设备活跃度。
- **主要 UI**
  - 卡片：设备数、最近活跃设备、最近入库时间。
  - 快捷：跳转设备列表、订阅配置。
- **依赖 API（建议）**
  - `GET /api/v1/health`（已有规范）
  - 可选：`GET /api/v1/devices`（做设备概览）
  - 可选：后端提供聚合概览接口（若不做，前端可按需请求并在 UI 层简化）
- **验收要点**
  - 在没有任何设备/数据时展示空态，不报错。

### 3) Topic 订阅配置（`/config/topic-subscriptions`）【Must】

- **目标**
  - 维护订阅项（pattern 支持 `+`、`#`），并支持启停。
- **主要 UI**
  - 列表表格：name、pattern、enabled、updatedAt、操作。
  - 新建/编辑弹窗或独立表单：name、pattern、enabled、notes。
  - 删除确认。
- **依赖 API**
  - `GET /api/v1/topic-subscriptions`
  - `POST /api/v1/topic-subscriptions`
  - `PATCH /api/v1/topic-subscriptions/:id`
  - `DELETE /api/v1/topic-subscriptions/:id`
- **校验要点（前端 + 后端一致）**
  - pattern 非空、语法合法（`docs/api-spec.md` 4.2 校验要点）
  - 避免重复 pattern（后端去重，前端可做提示）
- **验收要点**
  - 启停/更新后列表能正确刷新并显示最新状态。

### 4) MQTT Broker 配置（`/config/mqtt`）【Must】

- **目标**
  - 满足 `docs/requirements.md`：“可配置 Broker 与订阅 Topic（Pattern 由后台配置）”中的 Broker 部分。
- **主要 UI（建议字段）**
  - Broker URL（例如 `mqtt://host:1883`）
  - 用户名/密码（可选）
  - TLS/证书（可选）
  - 连接测试按钮（可选）
- **依赖**
  - `docs/api-spec.md` 暂无对应配置接口：实现时需补充 API（例如 `GET/PUT /api/v1/mqtt-broker-config`）。
- **验收要点**
  - 保存后刷新页面仍能读到已保存配置。

### 5) 环境/连接检查（`/config/env`）【Should】

- **目标**
  - 提供最小可观测性：当前 `VITE_API_BASE_URL`、health 检查结果、版本信息（若后端提供）。
- **主要 UI**
  - API Base URL
  - Health 状态：ok / error（含错误详情）
- **依赖 API**
  - `GET /api/v1/health`
- **验收要点**
  - 健康检查失败时展示可复制的错误信息（便于排障）。

### 6) 设备列表（`/devices`）【Must】

- **目标**
  - 按 `deviceId` 列出设备并可搜索。
- **主要 UI**
  - 搜索框（q）
  - 表格：deviceId、firstSeenAt、lastSeenAt
  - 点击行进入设备详情
- **依赖 API**
  - `GET /api/v1/devices`（支持 `q/limit/cursor`）
- **验收要点**
  - 空列表、加载态、错误态（如 401/403）处理正确。

### 7) 设备详情（概览）（`/devices/:deviceId`）【Must】

- **目标**
  - 展示该设备关键概况，并提供数据/控制入口。
- **主要 UI**
  - 标题：deviceId
  - 概览：firstSeenAt、lastSeenAt
  - Tab/按钮：数据（telemetry）、控制（commands）
- **依赖 API**
  - `GET /api/v1/devices/:deviceId`
- **验收要点**
  - 设备不存在（404）能展示“未找到”页面/提示。

### 8) 设备数据（趋势/列表）（`/devices/:deviceId/telemetry`）【Must】

- **目标**
  - 支持“最近数据 + 基础趋势 + 历史查询过滤”（见 `docs/requirements.md`）。
- **主要 UI**
  - 时间范围选择（from/to）
  - 过滤：type、topic（注意：topic 仅用于筛选/追溯，不做语义解析）
  - 数据表格（最近 N 条）
  - 趋势图（至少 1 个基础图表：例如按 ts 的 value 提取；如果 payload 不统一，先做原始 JSON 展示 + 选择字段）
- **依赖 API**
  - `GET /api/v1/devices/:deviceId/telemetry`（from/to/type/topic/limit/cursor）
- **验收要点**
  - from/to 缺省时：默认最近一段时间（例如近 1h/24h，具体实现自定）。
  - 对 payload 字段不稳定的情况：UI 不崩溃，至少可查看原始 payload。

### 9) 数据聚合统计（`/devices/:deviceId/telemetry/aggregate`）【Should】

- **目标**
  - 支持按时间桶、topic/type 维度统计（需求见 `docs/requirements.md` Should + `docs/api-spec.md` 6.2）。
- **主要 UI**
  - 维度选择：时间桶（1m/5m/1h/1d）、type/topic
  - 图表/表格：count、（可选）min/max/avg 等
- **依赖 API**
  - `GET /api/v1/devices/:deviceId/telemetry/aggregate`（可选接口）
- **验收要点**
  - 与 telemetry 页筛选条件一致，用户理解成本低。

### 10) 设备控制（`/devices/:deviceId/commands`）【Must】

- **目标**
  - 下发命令、查看命令状态机、看到回执/失败原因（见 `docs/control-spec.md`）。
- **主要 UI**
  - 命令表单：type、params（JSON 编辑器或结构化表单）、ttlMs、requestId（自动生成/可编辑）
  - 提交后显示 commandId，并轮询/订阅更新状态（实现策略自定）
  - 历史列表：按 status/type/from/to 过滤（若后端支持）
- **依赖 API**
  - `POST /api/v1/devices/:deviceId/commands`
  - `GET /api/v1/commands/:commandId`
  - （可选）`GET /api/v1/devices/:deviceId/commands`
- **权限/安全**
  - 必须鉴权；无控制权限时应隐藏/禁用下发入口并提示原因（见 `docs/auth-spec.md`）。
- **验收要点**
  - 幂等：同 requestId 重复提交不重复下发，UI 能显示“已存在命令并展示当前状态”。

### 11) 命令详情（`/commands/:commandId`）【Should】

- **目标**
  - 便于从审计/分享链接直达查看命令状态与上下文。
- **主要 UI**
  - 状态时间线：queued → sent → acked → succeeded/failed/timeout
  - lastError、issuedBy、issuedAt、params
- **依赖 API**
  - `GET /api/v1/commands/:commandId`

### 12) 授权管理（`/authz/device-access`）【Could】

- **目标**
  - 管理 `userId` - `deviceId` 的授权关系（read/control/config）。
- **依赖**
  - `docs/auth-spec.md` 定义了授权模型，但 `docs/api-spec.md` 未定义接口：落地时需补充 API。

### 13) 审计日志（`/audit/commands`）【Could】

- **目标**
  - 查询控制相关审计事件并导出，满足可追溯（`docs/auth-spec.md`）。
- **依赖**
  - 后端需提供审计查询 API（待补充）。

### 14) 告警（`/alerts`）【Could】

- **目标**
  - 阈值告警与通知配置（`docs/requirements.md` Could）。
- **依赖**
  - 后端告警模型与 API（待补充）。

### 15) 数据导出（`/export`）【Could】

- **目标**
  - 导出 CSV/JSON（`docs/requirements.md` Could）。
- **依赖**
  - 后端导出 API 或前端基于查询结果导出（受数据量限制）。

## 通用 UI/体验要求（建议）

- **i18n**：所有用户可见文本使用 `t()`（见 `docs/decisions/0012-i18n-react-i18next.md`）。
- **状态处理**：
  - Loading：骨架屏/Spinner
  - Empty：空态插画/提示（尤其是 devices/telemetry）
  - Error：按错误码显示（401/403/404/500），并提供重试按钮
- **可观测性**：
  - Dashboard/Env 页面展示 health 结果，便于部署排障（见 `docs/deployment.md`）。

