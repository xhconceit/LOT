# 存储库指南

- 仓库： https://github.com/xhconceit/lot

## 项目结构与模块组织

- 源码：`apps/`（`apps/admin-web` Web 管理台、`apps/mqtt-broker` Aedes broker、`apps/ingest-worker` 入库、`apps/api-service` HTTP API），`packages/`（`packages/shared` schema 校验/类型/工具等，`packages/domain`、`packages/application` 为内层）。
- 测试：`*.test.ts`.
- 文档：`docs/`

## 构建、测试和开发命令

- 运行时基线：Node 22+
- 安装依赖：`pnpm install`
- 常用命令：`pnpm dev` / `pnpm build` / `pnpm test` / `pnpm lint` / `pnpm fmt`
- 如果缺少依赖项（例如缺少 `node_modules` 、 `vitest not found` 或 `command not found`），请运行仓库的包管理器安装命令

## 编码风格与命名规范

- 语言：TypeScript (ESM)。建议使用严格类型；避免使用 any 。
- 使用：Oxlint 和 Oxfmt 进行格式化/代码检查；提交前运行 `pnpm lint` 与 `pnpm fmt`。
- 永远不要添加 `@ts-nocheck` ，也不要禁用 `no-explicit-any` ；修复根本原因，仅在需要时才更新 Oxlint/Oxfmt 配置。

## 国际化（i18n）

- 前端 `admin-web` 使用 `i18next` + `react-i18next`；翻译文件在 `apps/admin-web/src/locales/`（`zh-CN.json` / `en.json`）。
- **所有用户可见文本必须通过 `t()` 调用**，禁止硬编码中文或英文字符串到组件中。
- 新增页面/组件时，须同步在 `zh-CN.json` 和 `en.json` 中添加对应翻译 key。
- 后端校验错误使用 `I18nError`（`{ key, params? }`）类型，前端用 `t(error.key, error.params)` 翻译显示。
- 详见 `docs/decisions/0012-i18n-react-i18next.md`。

## 文档链接

- `docs/**` 存储着内部文档。
- `docs/decisions/**`: 存储关键决策记录（ADR）
- `docs/architecture.md`: 架构约束（模块边界 / 数据流 / 非目标）
- `docs/deployment.md`: 部署与 Docker（本地/生产部署要点）
- `docs/control-spec.md`: 控制规范（小程序/APP 控制设备）
- `docs/data-spec.md`: 数据规范（Topic / Schema / 入库规则）
- 文档内容必须通用：不得包含个人设备名称/主机名/路径；请使用占位符，例如 user@gateway-host 和“网关主机”。

## Agent 特定说明

- 切勿编辑 `node_modules` ( 包括 global/Homebrew/npm/git 安装的文件 ) 。更新会覆盖原文件。技能说明应放在 `tools.md` 或 `AGENTS.md` 文件中。
- 在存储库中的任何位置添加新的 `AGENTS.md` 时，还要添加指向它的 `CLAUDE.md` 符号链接（例如： `ln -s AGENTS.md CLAUDE.md` ）。
- 回答问题时，只给出有高度把握的答案：用代码验证；不要猜测。
- 任何使用 `pnpm.patchedDependencies` 的依赖项都必须使用确切的版本（不能使用 `^` / `~` ）。
- 修补依赖项（pnpm 补丁、覆盖或 vendored 更改）需要明确批准；默认情况下不要这样做。
- 发布规则：未经操作员明确同意，不得更改版本号；在运行任何 npm 发布/发布步骤之前，务必征得许可。
