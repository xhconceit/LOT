# 控制规范（小程序/APP → API → MQTT → 设备）

本文件定义“控制面（Control Plane）”的约定：**小程序/APP 通过 HTTP API 下发控制命令**，由后端负责鉴权、授权、审计、限流、重试与回执处理，再通过 MQTT 下行到设备。

> 原则：**客户端（小程序/APP）不得直连 MQTT**。

## 1. 控制链路（必须）

```text
小程序/APP  →  api-service（Hono, HTTPS）  →  MQTT publish  →  设备
                         ↑                          ↓
                         └────────── ack/状态回传（MQTT / HTTP） ────────┘
```

## 2. 命令模型（必须）

每条命令至少包含：

- `commandId`：命令唯一标识（建议由服务端生成；也可客户端提供并做幂等）
- `requestId`：请求幂等标识（客户端生成，避免重复点击导致重复下发）
- `deviceId`：目标设备（必须）
- `type`：命令类型（例如 `start` / `stop` / `set_speed`）
- `params`：命令参数（对象，可扩展）
- `ttlMs`：有效期（超时则不再执行/视为失败）
- `issuedBy`：操作者身份（来自鉴权上下文）
- `issuedAt`：下发时间（服务端时间）

## 3. 幂等与状态机（必须）

### 3.1 幂等

- **必须**：同一 `requestId` 在有效期内重复提交，返回同一 `commandId` 与当前状态，不重复下发

### 3.2 状态机

建议状态：

```text
queued → sent → acked → succeeded
                  └→ failed / timeout / cancelled
```

## 4. 鉴权/授权/审计（必须）

- **鉴权**：小程序用户身份（例如 openid/session）→ 后端会话/JWT（由实现决定）
- **授权**：用户对 `deviceId` 的“可控制/只读”权限
- **审计**：记录 `issuedBy`、`deviceId`、`type/params`、时间与结果（便于追责与排障）
- **限流**：按用户/设备/命令类型限流，避免误操作与刷指令

## 5. 设备侧回执（必须）

为保证用户体验与可观测性，设备侧必须支持回执：

- **必须**：对每条命令回传 `commandId` 对应的 ack（成功/失败/原因）
- **必须**：ack 需要能与命令一一对应（以 `commandId` 为主键）

## 6. Topic 映射（必须，且不从 topic 推断）

由于本项目约定 “Topic 无语义”，控制所需的 topic 通过后台配置维护：

- `commandPublishTopic`：下行命令发布 topic（按 `deviceId` 绑定）
- `commandAckTopic`：设备回执订阅 topic（按 `deviceId` 绑定或通配订阅）

> 这些 topic **不从名称推断**，全部由后台配置/绑定。

## 7. API 建议（占位）

建议最小接口：

- `POST /devices/:deviceId/commands`：创建命令（返回 `commandId`）
- `GET /commands/:commandId`：查询命令状态
- （可选）`GET /devices/:deviceId/commands`：列表与过滤

