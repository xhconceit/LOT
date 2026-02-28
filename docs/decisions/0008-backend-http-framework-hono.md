# ADR-0008：后端 HTTP 框架选用 Hono（TypeScript）

## 状态

已采纳（Accepted）

## 背景

项目从第一天就按可拆分微服务设计，需要一个：

- TypeScript 友好、足够轻量
- 适合构建独立 `api-service`
- 在 Node.js 运行时上工作良好

## 决策

`api-service` 采用 **TypeScript + Hono** 作为 HTTP 框架。

## 影响

- **正面**：轻量、开发快、跨运行时兼容性好；适合作为独立 API 服务
- **代价**：部分生态（插件/中间件）需要自己封装；需明确工程规范与目录结构

## 参考

- `docs/architecture.md`
