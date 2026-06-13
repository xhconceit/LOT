# LOT 项目完工清单（超详细执行版）

> 目标：把本项目从“基础骨架已搭建”推进到“可稳定上线 + 可持续迭代”。
>  
> 适用范围：`apps/mqtt-broker`、`apps/ingest-worker`、`apps/api-service`、`apps/admin-web`、`packages/*`、`docs/*`。

---

## 0. 当前状态快照（基线）

### 0.1 已完成（根据仓库现状）

- [x] Monorepo 基础结构搭建完成（`apps/*` + `packages/*`）
- [x] Clean Architecture 基础分层已建立（`domain`/`application`/`shared`）
- [x] `mqtt-broker` 可启动并处理连接与发布日志
- [x] `ingest-worker` 已实现 MQTT 消费、payload 校验、PostgreSQL 入库、设备自动建表基础流程
- [x] `api-service` 已有 Hono 基础框架与健康检查
- [x] `admin-web` 已有 React + Router + i18n 基础页面
- [x] 核心规范文档已存在（架构、数据、API、控制、鉴权、部署、页面）

### 0.2 未完成（核心缺口）

- [ ] Must 业务 API 尚未落地（Topic 配置、设备、遥测、控制）
- [ ] 鉴权/授权/审计/限流未完成
- [ ] 管理台业务页面未落地（目前仅 Dashboard 基础页）
- [ ] 自动化测试空白（当前无 `*.test.ts`）
- [ ] CI 质量门禁链路未验证完整
- [ ] Docker Compose 一键运行方案未落地

---

## 1. 完工定义（Definition of Done）

### 1.1 功能完工（Must）

- [ ] 满足 `docs/requirements.md` 中全部 Must
- [ ] 满足 `docs/api-spec.md` 中 Must API
- [ ] 满足 `docs/control-spec.md` 的控制链路强约束（鉴权、幂等、状态机、回执）
- [ ] 满足 `docs/admin-web-pages.md` 的 Must 页面

### 1.2 工程完工

- [ ] `pnpm lint` 通过
- [ ] `pnpm fmt` 或检查模式通过
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过
- [ ] 关键链路具备自动化测试（至少单元 + 集成）

### 1.3 交付完工

- [ ] 本地环境按文档可复现部署
- [ ] 具备最小上线与回滚手册
- [ ] 关键告警/日志可用于排障

---

## 2. 执行总计划（推荐 14~21 天）

### 2.1 阶段划分

- 阶段 A：规范冻结与 ADR（1 天）
- 阶段 B：数据面闭环（2~4 天）
- 阶段 C：API Must（3~5 天）
- 阶段 D：控制链路（3~6 天）
- 阶段 E：管理台 Must 页面（4~7 天）
- 阶段 F：测试与 CI（2~4 天）
- 阶段 G：部署与验收（2~3 天）

### 2.2 并行策略

- `api-service` 与 `admin-web` 可部分并行（前端先用 mock）
- 控制链路建议在 API 基础路由落地后推进
- 测试与文档可在每阶段末尾增量补齐，不要堆到最后

---

## 3. 阶段 A：规范冻结与 ADR（Day 1）

## A.1 目标

- 固化“怎么做算对”，避免后续反复返工。

## A.2 任务清单

- [ ] 在 `docs/decisions/` 新增 ADR：自动建表并发策略
- [ ] 新增 ADR：Schema 演进策略（先 JSONB）
- [ ] 新增 ADR：Topic 订阅配置生效策略（热更新 or 重启）
- [ ] 新增 ADR：控制命令状态机与超时规则
- [ ] 确认 `api-spec` 与 `admin-web-pages` 字段命名一致

## A.3 产出物

- [ ] `docs/decisions/00xx-*.md`（至少 3 份）
- [ ] API 字段命名对齐表（可附录于本文件或 ADR）

## A.4 验收标准

- [ ] 所有团队成员能依据 ADR 执行同一实现策略
- [ ] 关键争议点已明确（不再开放式讨论）

---

## 4. 阶段 B：数据面闭环（MQTT -> Ingest -> PostgreSQL）

## B.1 目标

- 从消息接入到入库可稳定运行，且可追溯。

## B.2 ingest-worker 详细任务

- [ ] 移除硬编码 `#` 订阅依赖，改为读取后台配置
- [ ] 启动时加载 enabled 订阅项并批量订阅
- [ ] 支持配置刷新机制（定时拉取或事件触发）
- [ ] 订阅变更时支持增量变更（退订旧项、订阅新项）
- [ ] 明确刷新失败处理（回退到上次成功快照）

## B.3 payload 校验与日志

- [ ] 非 JSON payload 记录错误并丢弃
- [ ] payload 缺失 `deviceId` 时回退 MQTT `clientId`
- [ ] `payload.deviceId` 与 `clientId` 同时存在且不一致时记录 warning，并按既定优先级处理
- [ ] 无法得到合法设备标识（payload 与 `clientId` 均缺失/非法）时记录错误并丢弃
- [ ] `ts` 非数字时采用服务端时间并记录 warning
- [ ] 日志至少包含 `topic`、`raw`、错误 key、时间戳

## B.4 存储与建表

- [ ] 设备表 upsert 逻辑幂等
- [ ] 设备表维护 `first_seen_at` 与 `last_seen_at`
- [ ] telemetry 表字段满足规范（`ts/topic/type/payload_raw/ingested_at`）
- [ ] 建表逻辑并发安全（多实例/多消息并发不崩）
- [ ] table 名称合法化（字符替换 + 长度限制）

## B.5 索引与性能

- [ ] 为查询主路径建立索引（`ts desc`）
- [ ] 根据查询路径选择复合索引（`type, ts` / `topic, ts`）
- [ ] 用 SQL 计划验证索引命中（保留验证记录）

## B.6 异常恢复

- [ ] 数据库临时不可用重试（指数退避）
- [ ] 超过重试阈值后输出高优先级错误日志
- [ ] worker 关闭流程优雅（flush + close）

## B.7 验收脚本

- [ ] 构造 4 类消息：合法、缺 `deviceId` 但可回退 `clientId`、`payload.deviceId` 与 `clientId` 冲突、非法 JSON
- [ ] 验证合法消息落库成功
- [ ] 验证缺 `deviceId` 但有 `clientId` 的消息可落库
- [ ] 验证非法消息不入库且日志可追溯
- [ ] 验证新设备首次消息自动建表成功

---

## 5. 阶段 C：API Must 实现（api-service）

## C.1 目标

- 提供与 `docs/api-spec.md` 对齐的核心 REST API。

## C.2 Topic Subscription API

- [ ] `GET /api/v1/topic-subscriptions`
- [ ] `POST /api/v1/topic-subscriptions`
- [ ] `PATCH /api/v1/topic-subscriptions/:id`
- [ ] `DELETE /api/v1/topic-subscriptions/:id`
- [ ] `pattern` 语法校验（MQTT filter）
- [ ] `pattern` 去重约束（唯一索引或逻辑约束）

## C.3 Device API

- [ ] `GET /api/v1/devices`（q/limit/cursor）
- [ ] `GET /api/v1/devices/:deviceId`
- [ ] 统一分页策略（cursor 或 offset，二选一并固化）

## C.4 Telemetry API

- [ ] `GET /api/v1/devices/:deviceId/telemetry`
- [ ] 支持 `from/to/type/topic/limit/cursor`
- [ ] 时间范围参数校验（from <= to）
- [ ] 默认范围策略（例如最近 1h/24h）

## C.5 Command API（先最小可用）

- [ ] `POST /api/v1/devices/:deviceId/commands`
- [ ] `GET /api/v1/commands/:commandId`
- [ ] 按规范返回 `commandId` 与状态

## C.6 错误与响应一致性

- [ ] 统一 success 响应 `{ ok: true, data }`
- [ ] 统一 error 响应 `{ ok: false, error }`
- [ ] 错误码与 `key` 全量映射
- [ ] 每个路由定义最小错误集合（400/401/403/404/409/429/500）

## C.7 验收标准

- [ ] Postman 或脚本可跑通全部 Must API
- [ ] 参数异常返回 `VALIDATION_ERROR`
- [ ] 找不到资源返回 `NOT_FOUND`
- [ ] 业务冲突返回 `CONFLICT`

---

## 6. 阶段 D：控制链路（Control Plane）闭环

## D.1 目标

- 实现“小程序/APP -> API -> MQTT -> ACK -> 状态可查”的完整链路。

## D.2 命令模型

- [ ] 持久化 `commandId/requestId/deviceId/type/params/ttlMs/status/issuedBy/issuedAt`
- [ ] requestId 幂等约束（唯一索引 + 业务有效期策略）
- [ ] 可记录失败原因 `lastError`

## D.3 状态机

- [ ] `queued -> sent -> acked -> succeeded`
- [ ] 分支：`failed` / `timeout` / `cancelled`
- [ ] 所有状态变更记录时间戳
- [ ] 禁止非法状态跳转（例如 timeout 后不允许回到 queued）

## D.4 MQTT 下发与 ACK

- [ ] 从配置读取 publish topic 与 ack topic
- [ ] 下发 payload 中包含 `commandId`
- [ ] ACK payload 必须可关联 `commandId`
- [ ] ACK 缺失 `commandId` 的处理策略明确（记录 + 丢弃）

## D.5 安全与权限

- [ ] 控制接口强制鉴权
- [ ] 设备粒度授权校验（`device:control`）
- [ ] 审计日志包含 `issuedBy/deviceId/type/params/result`
- [ ] 控制接口限流（用户 + 设备 + 命令类型）

## D.6 幂等验证用例

- [ ] 同 requestId 重复 10 次只下发一次
- [ ] 返回同一 `commandId` 且状态一致
- [ ] ttl 到期后状态转 timeout

## D.7 验收标准

- [ ] 控制命令端到端链路稳定
- [ ] 权限不足场景稳定返回 403
- [ ] 审计记录可按 commandId 追溯全流程

---

## 7. 阶段 E：admin-web Must 页面落地

## E.1 目标

- 让管理台具备完整业务可操作性。

## E.2 路由与页面

- [ ] `/login` 登录
- [ ] `/` Dashboard
- [ ] `/config/topic-subscriptions`
- [ ] `/config/mqtt`
- [ ] `/devices`
- [ ] `/devices/:deviceId`
- [ ] `/devices/:deviceId/telemetry`
- [ ] `/devices/:deviceId/commands`
- [ ] 401/403/404 页面

## E.3 页面状态规范

- [ ] 所有页面支持 loading/empty/error
- [ ] 所有 API 错误可翻译显示
- [ ] 全局请求失败提示与重试入口统一

## E.4 i18n 落地清单

- [ ] 所有可见文案必须通过 `t()`
- [ ] 同步维护 `zh-CN.json` 与 `en.json`
- [ ] 新增错误 key 对齐后端 `error.key`
- [ ] 严禁硬编码中文或英文到组件

## E.5 Dashboard 细化

- [ ] 显示 health 状态
- [ ] 显示设备总数与活跃设备
- [ ] 最近数据时间
- [ ] 快捷入口（设备、Topic 配置）

## E.6 设备列表/详情

- [ ] 设备列表搜索、分页
- [ ] 设备详情显示 firstSeen/lastSeen
- [ ] 详情页快速跳转 telemetry 与 commands

## E.7 遥测页面

- [ ] 时间范围过滤
- [ ] type/topic 过滤（topic 仅追溯，不做语义推断）
- [ ] 最近数据列表
- [ ] 基础趋势图（至少一类）
- [ ] payload 不规则时保持可查看原始数据

## E.8 控制页面

- [ ] 命令表单（type/params/ttl/requestId）
- [ ] 提交后显示 commandId
- [ ] 状态轮询或订阅更新
- [ ] 历史记录与筛选（如后端已支持）

## E.9 验收标准

- [ ] 从登录到控制下发全流程可走通
- [ ] 空数据、弱网、权限不足场景 UX 可接受
- [ ] 双语切换无 key 泄漏

---

## 8. 阶段 F：测试与 CI 质量门禁

## F.1 单元测试（最小集合）

- [ ] `IngestTelemetry`：正常入库、异常路径
- [ ] `ListDevices`：分页边界
- [ ] `QueryTelemetry`：过滤参数正确转发
- [ ] 命令状态机：合法跳转/非法跳转
- [ ] requestId 幂等逻辑

## F.2 集成测试（最小集合）

- [ ] topic-subscriptions CRUD 集成测试
- [ ] devices/telemetry 查询集成测试
- [ ] commands 提交 + 状态查询集成测试
- [ ] ingest-worker 对真实 PG 的集成测试

## F.3 前端测试（最小集合）

- [ ] 关键页面渲染测试（Dashboard、Devices、Commands）
- [ ] API 错误态 UI 测试
- [ ] 权限态（403）页面逻辑测试
- [ ] i18n key 存在性检查脚本

## F.4 CI 流水线

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm lint`
- [ ] `pnpm fmt`（或 check 模式）
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] 覆盖率报告（可选）

## F.5 验收标准

- [ ] 主分支门禁全绿
- [ ] 关键路径至少有自动化回归保护

---

## 9. 阶段 G：部署、运维与上线准备

## G.1 环境变量与配置

- [ ] 完整 `.env.example`
- [ ] 分服务配置文档（api/ingest/broker/admin）
- [ ] 敏感配置从环境注入，不进入仓库

## G.2 容器化

- [ ] `docker-compose.yml` 本地一键起服务
- [ ] `postgres` volume 持久化
- [ ] 服务启动顺序与健康检查
- [ ] admin-web 与 api-service 跨域/反向代理确认

## G.3 运行观测

- [ ] 关键日志可检索（按 commandId/deviceId）
- [ ] 生产日志级别收敛到关键节点
- [ ] 关键错误告警（至少接入 stderr 监控）

## G.4 回滚预案

- [ ] 应用版本回滚步骤
- [ ] 配置回滚步骤
- [ ] 数据库变更回滚策略（若有 migration）

## G.5 验收标准

- [ ] 新环境可在 30 分钟内拉起
- [ ] 回滚流程可演练并成功

---

## 10. 每日执行看板模板（可复制）

## Day N 计划

- [ ] 今日目标（1~3 项）
- [ ] 关联模块（apps/packages/docs）
- [ ] 风险点
- [ ] 验收命令

## Day N 完成

- [ ] 已完成任务
- [ ] 未完成与阻塞
- [ ] 产出 PR/文档
- [ ] 次日计划

---

## 11. 命令清单（执行与验收）

```bash
pnpm install
pnpm lint
pnpm fmt
pnpm test
pnpm build
pnpm dev
pnpm dev:api
pnpm dev:admin
```

可选（分服务联调）：

```bash
# 终端 1
pnpm --filter @lot/mqtt-broker dev

# 终端 2
pnpm --filter @lot/ingest-worker dev

# 终端 3
pnpm --filter @lot/api-service dev

# 终端 4
pnpm --filter @lot/admin-web dev
```

---

## 12. 风险清单与缓解策略

### R1：控制命令重复下发

- 风险：用户重复点击导致设备误操作
- 缓解：
  - [ ] requestId 幂等唯一约束
  - [ ] 前端提交按钮节流/禁用
  - [ ] 后端返回已有 commandId

### R2：设备首次上线并发建表冲突

- 风险：高并发导致 DDL 冲突/阻塞
- 缓解：
  - [ ] 建表语句幂等
  - [ ] 并发锁或冲突忽略策略
  - [ ] 失败重试与日志

### R3：topic 配置变更不生效

- 风险：运营改配置后采集无变化
- 缓解：
  - [ ] 定时刷新策略
  - [ ] 刷新成功/失败可观测
  - [ ] 管理台展示“最后刷新时间”

### R4：i18n 漏翻导致生产界面出现 key

- 风险：用户体验差，影响可用性
- 缓解：
  - [ ] 提交前 key 扫描脚本
  - [ ] PR 检查新增文案是否双语同步

---

## 13. 最终上线前逐项核对（Release Checklist）

- [ ] Must 功能全部验证通过
- [ ] API 契约与前端调用字段一致
- [ ] 控制链路已完成幂等/鉴权/审计/限流
- [ ] 关键日志可追溯 `deviceId` 与 `commandId`
- [ ] 全量测试通过
- [ ] 构建产物可部署
- [ ] 部署文档可复现
- [ ] 回滚方案可执行
- [ ] 操作员确认上线窗口与监控值守

---

## 14. 里程碑完成打卡（建议）

### M1：数据可稳定入库

- [ ] ingest + pg 闭环完成

### M2：API Must 可用

- [ ] Must 路由可联调

### M3：控制链路闭环

- [ ] 命令下发到 ACK 完整可查

### M4：管理台可操作

- [ ] Must 页面全部可用

### M5：可上线

- [ ] 质量门禁 + 部署 + 回滚齐备

---

## 15. 备注

- 本清单优先保障 v1 可交付，不在 v1 强行塞入 Could 项。
- 如需加速，可先用 mock 数据并行推进前端，再在联调阶段切真实 API。
- 每完成一个阶段，建议同步更新本文件勾选状态，形成项目真实进度看板。
