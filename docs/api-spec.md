# API 规范（api-service）

本文件描述 `api-service`（TypeScript + Hono）对外提供的 HTTP API 契约，供 `admin-web`、小程序/APP 与其他服务对接。

> 约定：**设备归属以 payload 内的 `deviceId` 为准**；**Topic 不承载业务语义**，仅用于订阅过滤与来源标记（见 `docs/data-spec.md`、`docs/control-spec.md`）。

## 1. 基本约定

- **Base URL**：`https://<api-host>`
- **版本前缀**：`/api/v1`
- **Content-Type**：`application/json; charset=utf-8`
- **时间戳**：毫秒（`ts`/`issuedAt` 等）

### 1.1 通用响应格式

成功：

```json
{ "ok": true, "data": {} }
```

失败：

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "human readable message",
    "details": {}
  }
}
```

### 1.2 通用错误码（建议）

- `UNAUTHORIZED`：未登录/鉴权失败
- `FORBIDDEN`：无权限
- `NOT_FOUND`：资源不存在
- `VALIDATION_ERROR`：参数校验失败
- `CONFLICT`：幂等冲突/资源状态冲突
- `RATE_LIMITED`：触发限流
- `INTERNAL_ERROR`：内部错误

## 2. 鉴权与权限（占位）

控制相关接口必须鉴权/授权（见 `docs/control-spec.md`）。鉴权方式（Cookie Session / JWT / 小程序 session）由实现决定，但 API 必须能在日志与审计中得到操作者身份。

建议在控制接口要求以下头部（或等价字段）：

- `Authorization: Bearer <token>`（如采用 JWT）

## 3. 健康检查

### 3.1 GET `/api/v1/health`

用于探活与负载均衡健康检查。

响应：

```json
{ "ok": true, "data": { "status": "ok" } }
```

## 4. Topic Pattern（后台配置订阅）

> Pattern 为 MQTT topic filter（支持 `+`、`#`），由后台配置维护，不在代码中硬编码（见 `docs/data-spec.md`）。

资源：`TopicSubscription`

```json
{
  "id": "sub_123",
  "name": "生产环境订阅",
  "pattern": "#",
  "enabled": true,
  "notes": "optional",
  "createdAt": 1710000000000,
  "updatedAt": 1710000000000
}
```

### 4.1 GET `/api/v1/topic-subscriptions`

查询订阅配置列表。

### 4.2 POST `/api/v1/topic-subscriptions`

创建订阅配置。

请求：

```json
{ "name": "xxx", "pattern": "#", "enabled": true, "notes": "optional" }
```

校验要点（必须）：

- `pattern` 非空且符合 MQTT filter 语法
- 去重（避免重复 pattern）

### 4.3 PATCH `/api/v1/topic-subscriptions/:id`

更新订阅配置（支持启停）。

### 4.4 DELETE `/api/v1/topic-subscriptions/:id`

删除订阅配置。

## 5. 设备

资源：`Device`

```json
{
  "deviceId": "dev_001",
  "firstSeenAt": 1710000000000,
  "lastSeenAt": 1710000000000
}
```

### 5.1 GET `/api/v1/devices`

列出已发现设备（按 `deviceId`）。

查询参数（建议）：

- `q`：模糊搜索 deviceId
- `limit`：默认 50，最大 200
- `cursor`：游标分页（实现自定）

### 5.2 GET `/api/v1/devices/:deviceId`

获取单个设备概览（最近上报时间、统计等）。

## 6. 遥测/数据查询

资源：`TelemetryRow`（示例）

```json
{
  "id": "row_123",
  "deviceId": "dev_001",
  "ts": 1710000000000,
  "topic": "any/topic",
  "type": "telemetry",
  "payload": { "deviceId": "dev_001", "ts": 1710000000000, "data": {}, "type": "telemetry" },
  "ingestedAt": 1710000000000
}
```

### 6.1 GET `/api/v1/devices/:deviceId/telemetry`

按设备查询数据（读 PostgreSQL）。

查询参数（建议）：

- `from`：起始时间（ms）
- `to`：结束时间（ms）
- `type`：按 payload.type 过滤（可选）
- `topic`：按原始 topic 过滤（可选）
- `limit`：默认 200，最大 2000
- `cursor`：游标分页（可选）

### 6.2 GET `/api/v1/devices/:deviceId/telemetry/aggregate`（可选）

聚合查询（例如按时间桶、type/topic 维度统计）。

## 7. 控制命令

> 控制链路与约束以 `docs/control-spec.md` 为准。客户端不得直连 MQTT（ADR-0011）。

资源：`Command`

```json
{
  "commandId": "cmd_123",
  "requestId": "req_abc",
  "deviceId": "dev_001",
  "type": "start",
  "params": { "speed": 10 },
  "ttlMs": 30000,
  "status": "queued",
  "issuedBy": "user_123",
  "issuedAt": 1710000000000,
  "lastError": null
}
```

### 7.1 POST `/api/v1/devices/:deviceId/commands`

创建控制命令（幂等）。

请求：

```json
{ "requestId": "req_abc", "type": "start", "params": {}, "ttlMs": 30000 }
```

要求：

- **必须**：`requestId` 幂等
- **必须**：鉴权 + 授权（该用户可控制该设备）

响应：

```json
{ "ok": true, "data": { "commandId": "cmd_123" } }
```

### 7.2 GET `/api/v1/commands/:commandId`

查询命令状态。

### 7.3 GET `/api/v1/devices/:deviceId/commands`（可选）

按设备列出命令历史（支持 `status/type/from/to` 过滤）。
