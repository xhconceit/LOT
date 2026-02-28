# ADR-0012：国际化方案选用 i18next + react-i18next

## 状态

已采纳（Accepted）

## 背景

管理台需要支持多语言（至少中文 / 英文），后端 API 返回的校验错误也需要可翻译。

## 决策

- **前端**（`admin-web`）：使用 `i18next` + `react-i18next`
  - 翻译文件：`src/locales/{zh-CN,en}.json`，按 `app` / `nav` / `common` / `error` 等命名空间组织
  - 语言检测：优先读取 `localStorage`，回退到浏览器语言，默认 `zh-CN`
  - 初始化入口：`src/i18n.ts`，在 `main.tsx` 中 import 即可生效
- **后端**（`packages/shared`）：校验错误返回 `I18nError`（`{ key, params? }`），前端用 `t(error.key, error.params)` 翻译

## 用法

### 组件中使用

```tsx
import { useTranslation } from "react-i18next";

function Example() {
  const { t } = useTranslation();
  return <span>{t("common.save")}</span>;
}
```

### 切换语言

```tsx
const { i18n } = useTranslation();
i18n.changeLanguage("en");
```

### 新增翻译

在 `src/locales/zh-CN.json` 和 `src/locales/en.json` 中同步添加对应 key。

## 影响

- **正面**：翻译集中管理；后端错误解耦语言；新增语言只需加 JSON 文件
- **代价**：所有用户可见文本须通过 `t()` 调用，不可硬编码

## 参考

- `docs/architecture.md`
- ADR-0009
