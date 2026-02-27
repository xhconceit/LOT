# ADR-0010：TypeScript 构建工具选用 tsdown

## 状态

已采纳（Accepted）

## 背景

本项目采用 Monorepo + 微服务拆分（`apps/*` + `packages/*`），需要一套统一的 TypeScript 构建方式来：

- 构建后端服务与共享包
- 输出稳定的产物（便于容器化/部署）
- 降低各服务之间的构建差异与维护成本

## 决策

TypeScript 的构建/打包统一使用 **tsdown**。

## 影响

- **正面**：构建链路统一；便于复用与标准化脚本
- **代价**：需要在各 `apps/*`、`packages/*` 中统一配置与脚本（后续落地时补齐）

## 参考

- `docs/architecture.md`

