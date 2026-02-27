# LOT - MQTT 物联网数据采集与实时可视化

面向物联网（IoT）的 **MQTT 数据采集**、**入库** 与 **实时可视化**项目。

## 功能概览

- **MQTT**：Aedes Broker 接入设备消息（Topic 仅作为来源标记/订阅过滤）
- **数据存储**：写入 PostgreSQL，便于查询与统计
- **实时可视化**：Web 端实时展示（Vite + React）

## 技术栈

- **设备/协议**：MQTT
- **MQTT**：Aedes
- **后端（HTTP API）**：TypeScript + Hono
- **运行时**：Node.js
- **包管理**：pnpm
- **Web 管理台**：Vite（React）+ React Router + Zustand
- **UI**：shadcn/ui
- **样式**：Tailwind CSS
- **数据存储**：PostgreSQL

## 工程化

- **测试**：Vitest
- **Lint**：oxlint
- **格式化**：oxfmt
- **TypeScript 构建**：tsdown

## 环境要求

- **Node.js**：建议使用 22+（LTS）
- **pnpm**：建议使用最新稳定版
- **PostgreSQL**：本地或远程均可

## 安装与启动

```bash
# 安装依赖
pnpm install

# 开发启动
pnpm dev
```

## 常用命令

```bash
# 构建 / 启动
pnpm build
pnpm start

# 测试
pnpm test

# 代码质量
pnpm lint
pnpm fmt
```

## 文档与约定（必读）

- **数据规范（Topic / Schema / 入库规则）**：见 `docs/data-spec.md`
- **控制规范（小程序/APP 控制设备）**：见 `docs/control-spec.md`
- **API 规范（api-service）**：见 `docs/api-spec.md`
- **鉴权与权限规范（Auth Spec）**：见 `docs/auth-spec.md`
- **部署与 Docker**：见 `docs/deployment.md`
- **架构约束（模块边界 / 数据流 / 非目标）**：见 `docs/architecture.md`
- **需求清单（Must / Should / Could）**：见 `docs/requirements.md`
- **关键决策记录（ADR）**：见 `docs/decisions/`
