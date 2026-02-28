# 部署与 Docker（Deployment）

本文件描述本项目在本地与生产环境的部署方式（优先 Docker/容器化），并给出服务依赖、端口规划与环境变量清单。

> 说明：当前仓库以文档为主，具体镜像构建与 `docker-compose.yml` 会在 `apps/*` 代码落地后补齐。

## 1. 服务清单（微服务）

- **mqtt-broker**：Aedes MQTT Broker（接入设备）
- **ingest-worker**：消费 MQTT 消息并入库（自动建表）
- **api-service**：HTTP API（Hono），提供后台配置、数据查询、控制命令入口
- **admin-web**：Web 管理台（Vite + React）
- **postgres**：PostgreSQL 数据库

服务职责与边界见 `docs/architecture.md`。

## 2. 端口规划（建议）

> 可按环境调整，以下为默认建议值。

- **mqtt-broker**
  - MQTT：`1883/tcp`
  - MQTT over WebSocket（可选）：`8083/tcp`
- **api-service**
  - HTTP：`3000/tcp`
- **admin-web**
  - HTTP（静态站点）：`5173/tcp`（开发）/ `80/tcp`（生产容器）
- **postgres**
  - `5432/tcp`

## 3. 环境变量清单（建议）

### 3.1 postgres

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### 3.2 api-service

- `PORT=3000`
- `DATABASE_URL=postgres://user:pass@postgres:5432/lot`
- `JWT_SECRET`（或等价签名密钥）
- `CORS_ORIGIN`（例如 `http://localhost:5173`）
- （可选）`RATE_LIMIT_*`、`LOG_LEVEL`

### 3.3 ingest-worker

- `DATABASE_URL=postgres://user:pass@postgres:5432/lot`
- `MQTT_URL=mqtt://mqtt-broker:1883`
- `TOPIC_CONFIG_REFRESH_MS=5000`（示例：订阅配置刷新频率；实际策略见 `docs/data-spec.md`）
- （可选）`LOG_LEVEL`

### 3.4 mqtt-broker

- `MQTT_PORT=1883`
- `WS_PORT=8083`（可选）
- （可选）鉴权相关：`BROKER_AUTH_*`

### 3.5 admin-web

- `VITE_API_BASE_URL=http://localhost:3000/api/v1`（开发）
- 生产环境可通过反向代理或构建时注入环境变量（以实现为准）

> 建议在仓库根目录提供 `.env.example`，并在落地 Compose 时引用。

## 4. Docker Compose（规划）

落地后建议提供：

- `docker-compose.yml`：开发/本地一键启动
- `docker-compose.prod.yml`：生产最小化（或改用 k8s）

Compose 内应包含：

- `postgres`：挂载 volume 持久化数据
- `mqtt-broker`：暴露 1883（必要时加 8083）
- `api-service`：依赖 postgres（并做健康检查）
- `ingest-worker`：依赖 mqtt-broker + postgres
- `admin-web`：依赖 api-service（或通过反向代理统一域名）

## 5. 生产建议（要点）

- **TLS**：公网必须 HTTPS；MQTT 建议启用 TLS（或通过网关终止）
- **密钥管理**：`JWT_SECRET`、数据库密码等通过 Secret 管理，不提交仓库
- **权限隔离**：数据库账号最小权限；服务间网络隔离
- **观测**：保留关键审计日志（控制链路尤其重要，见 `docs/auth-spec.md`、`docs/control-spec.md`）
