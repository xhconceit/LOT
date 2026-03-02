# ADR-0013：环境变量（.env）放置与加载策略

## 状态

提议（Proposed）

## 背景

本项目为 Monorepo（`apps/*` + `packages/*`），开发阶段既可能：

- 全部服务本机直跑（`pnpm dev`）
- 仅依赖用 Docker（Postgres/MQTT），业务服务本机直跑
- 或全部用 Compose 联调

因此需要明确：

- `.env` 文件放在哪里
- 开发时如何加载并让 `apps/*` 生效
- 生产环境如何注入（不依赖 `.env` 文件）

## 决策（提议）

### A. Root 统一管理（推荐）

- 仓库根目录提供：
  - `.env.example`（模板，提交到仓库）
  - `.env`（本地实际配置，不提交）
- `pnpm dev` 启动时统一加载 root `.env`，并让所有 `apps/*` 子进程继承环境变量
- `admin-web`（Vite）如需从 root 读取 `.env`，使用 `envDir` 或通过启动脚本注入（以实现为准）

### B. 每个 app 自管理（备选）

- 每个 `apps/<name>/.env.example` + `apps/<name>/.env`
- 优点：隔离强；缺点：维护成本高、跨服务变量（如 DB/MQTT）易不一致

### 生产环境原则

- 生产环境通过容器编排（Compose/K8s/平台）注入环境变量或 Secret
- 不依赖 `.env` 文件，也不将密钥写入仓库

## 影响

- **正面**：开发体验一致；一条命令启动时不需要逐个配置
- **代价**：需要在 dev 启动脚本/工具链里显式约定加载方式（尤其是 Vite 的 env 目录）

## 参考

- `docs/deployment.md`
- `docs/glossary.md`

