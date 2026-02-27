# ADR-0009：Web 管理台选用 Vite（React）+ React Router + Zustand

## 状态

已采纳（Accepted）

## 背景

本项目后端从第一天起按可拆分微服务设计（独立 `api-service`），Web 管理台属于纯前端应用：

- 不依赖 SSR/SEO
- 仅消费 `api-service` 的 HTTP API
- 需要清晰的路由与轻量状态管理

## 决策

`admin-web` 采用：

- 构建工具：Vite
- UI 框架：React
- 路由：React Router
- 状态管理：Zustand
- 组件/样式：shadcn/ui + Tailwind CSS

## 影响

- **正面**：部署简单（静态资源）；开发体验好；与“后端独立”边界清晰
- **代价**：如果未来需要同域 Cookie 会话/BFF，需要在边界上额外设计（可由 `api-service` 或网关承担）

## 参考

- `docs/architecture.md`

