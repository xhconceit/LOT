# 设计系统规范

基于 LOT 项目 `.pen` 设计稿的系统化设计规范。

## 目录

- [色彩规范](#色彩规范)
- [字体规范](#字体规范)
- [布局规范](#布局规范)
- [组件规范](#组件规范)
- [页面结构](#页面结构)
- [状态与交互](#状态与交互)

---

## 色彩规范

### 主色调

| 用途 | 色值 | CSS 变量名 | 使用场景 |
|------|------|-------------|----------|
| 主品牌色 | `#3B82F6` | `$primary-blue` | 主要操作按钮、激活状态、链接 |
| 成功/在线 | `#10B981` | `$success-green` | 健康状态、在线徽章、成功提示 |
| 警告/危险 | `#EF4444` | `$danger-red` | 离线设备、错误提示、危险操作 |
| 信息/辅助 | `#64748B` | `$info-gray` | 次要文本、图标颜色 |

### 中性色

| 用途 | 色值 | CSS 变量名 |
|------|------|-------------|
| 主要文字 | `#111827` | `$text-primary` |
| 次要文字 | `#6B7280` | `$text-secondary` |
| 禁用文字 | `#9CA3AF` | `$text-disabled` |
| 边框 | `#E5E7EB` | `$border-color` |
| 背景色 | `#FFFFFF` | `$bg-white` |
| 内容背景 | `#F9FAFB` | `$bg-content` |

### 语义色

| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 在线状态背景 | `#ECFDF5` | 在线徽章背景 |
| 在线状态文字 | `#059669` | 在线状态文字 |
| 离线状态背景 | `#F3F4F6` | 离线徽章背景 |
| 离线状态文字 | `#6B7280` | 离线状态文字 |
| 激活导航背景 | `#E0F2FE` | 当前选中导航项 |
| 激活导航文字 | `#0284C7` | 当前选中导航文字 |

### 组件背景色

| 组件 | 色值 | 使用场景 |
|------|------|----------|
| 卡片阴影 | `rgba(0, 0, 0, 0.05)` | 白色卡片的投影效果 |

---

## 字体规范

### 字体家族

- **主要字体**: `Inter`
- **图标字体**: `lucide` (图标库)

### 字体大小

| 层级 | 字号 | 字重 | 使用场景 |
|------|------|------|----------|
| H1 / 页面大标题 | 24px | 600 | 页面主标题（如"设备列表"） |
| H2 / 页面标题 | 20px | 600 | 顶栏页面标题 |
| H3 / 卡片标题 | 14px | 500 | 表头、卡片标题 |
| 正文大 | 14px | normal | 主要文本内容 |
| 正文小 | 13px | normal | 次要信息、时间戳 |
| 辅助文本 | 12px | 600 | 状态徽章文字、标签 |
| 按钮文本 | 14px | 500 | 按钮文字 |

### 字母间距

- **表头**: `letterSpacing: 0.5px`（提升可读性）

---

## 布局规范

### 页面尺寸

- **画布宽度**: `1280px`
- **画布高度**: `800px`
- **侧边栏宽度**: `151px`

### 间距系统

| 间距类型 | 值 | 使用场景 |
|----------|-----|----------|
| 微间距 | 2px | 导航菜单项之间 |
| 小间距 | 8px | 图标与文字、徽章内边距 |
| 中间距 | 16px | 卡片内边距、行间距、列表项 |
| 大间距 | 24px | 组件之间、模块间隔 |
| 超大间距 | 32px | 主内容区内边距、主要区块 |

### 圆角规范

| 元素 | 圆角值 |
|------|--------|
| 小按钮/徽章 | 8px |
| 中等卡片 | 10px |
| 大卡片/容器 | 12px |
| 导航项 | 6px |
| 徽章胶囊 | 20px |
| 头像/圆形图标 | 16px |

### 内边距规范

| 元素 | Padding |
|------|---------|
| 顶栏 | `[0, 200, 0, 32]` |
| 侧边栏 | `16px` 垂直，`0px` 水平 |
| 导航菜单 | `[0, 12px]` 垂直 |
| 导航项 | `[10px, 0, 10px, 12px]` |
| 表格容器 | `28px` 全方位 |
| 统计卡片 | `[20, 24px]` 全方位 |
| 按钮 | `[10, 16px]` 全方位 |
| 输入框 | `[10, 16px]` 全方位 |

---

## 组件规范

### 顶栏（Header）

**Node 结构**: 顶栏 → 左侧标题区 | 右侧状态区

**属性**:
- 高度: `64px`
- 背景色: `#FFFFFF`（亮色）/ `#1E293B`（暗色）
- 布局: `horizontal`, `justifyContent: "space_between"`, `alignItems: "center"`

**左侧内容**:
- 主题和语言切换: `layout: "horizontal"`, `gap: 16px`, `alignItems: "center"`, `width: "fill_container"`
- Logo 容器: `layout: "horizontal"`, `gap: 16px`, `alignItems: "center"`
- Logo: `fontSize: 24px`, `fontWeight: 700`, `fill: #3B82F6`
- 页面标题: `fontSize: 20px`, `fontWeight: 600`
- Logo 和标题位置：水平并排显示

**右侧内容**:
- 主题切换图标: `width: 20px`, `height: 20px`
  - 亮色主题: `moon`（显示"切换到暗色"提示）
  - 暗色主题: `sun`（显示"切换到亮色"提示）
- 语言切换图标: `width: 20px`, `height: 20px`, `globe`
- 健康状态徽章: `cornerRadius: 20px`, `fill: #10B981`, `padding: [6, 12]`
- 用户菜单: `cornerRadius: 8px`, `padding: [8, 16px]`, 带边框

### 顶部控制栏（Top Control Bar）

**Node 结构**: 顶栏 → 顶部控制栏 | 右侧状态区

**位置**: 位于页面顶部，跨整个宽度

**属性**:
- 布局: `horizontal`, `justifyContent: "space_between"`, `alignItems: "center"`
- 间距: `gap: 16px`

**左侧内容**:
- 主题和语言切换: `layout: "horizontal"`, `gap: 12px`, `alignItems: "center"`
  - 主题图标: `width: 20px`, `height: 20px`
  - 语言图标: `width: 20px`, `height: 20px`
- Logo 容器: `layout: "horizontal"`, `gap: 16px`, `alignItems: "center"`
  - Logo: `fontSize: 24px`, `fontWeight: 700`
  - 页面标题: `fontSize: 20px`, `fontWeight: 600`

**颜色变体**:
- 亮色主题: Logo 和标题使用亮色
- 暗色主题: Logo 使用 `#60A5FA`，标题使用 `#F1F5F9`

### 侧边栏导航（Sidebar Navigation）

**Node 结构**: 侧边栏 → 导航菜单 → 导航项

**属性**:
- 宽度: `151px`
- 高度: `fill_container`
- 背景色: `#FFFFFF`（亮色）/ `#1E293B`（暗色）
- 菜单间距: `gap: 2px`
- 菜单项间距: `gap: 8px`

**导航项状态**:

| 状态 | 背景色 | 文字颜色 | 图标颜色 |
|------|--------|----------|----------|
| 未选中 | `transparent` | `#475569` | `#64748B` |
| 已选中 | `#E0F2FE` | `#0284C7` | `#3B82F6` |

**导航项结构**:
- 图标: `width: 16px`, `height: 16px`
- 文字: `fontSize: 13px`
- 内边距: `[10px, 0, 10px, 12px]`

### 按钮（Button）

**主按钮**:
- 背景色: `#3B82F6`
- 文字颜色: `#FFFFFF`
- 圆角: `8px`
- 内边距: `[10, 16px]`

**次要按钮**:
- 背景色: `#FFFFFF`
- 文字颜色: `#374151`
- 边框: `1px solid #E5E7EB`
- 圆角: `8px`
- 内边距: `[10, 16px]`

**按钮内容**: 图标 + 文字，`gap: 8px`

### 输入框（Input）

**属性**:
- 背景色: `#FFFFFF`
- 边框: `1px solid #E5E7EB`
- 圆角: `8px`
- 内边距: `[10, 16px]`
- 布局: `horizontal`, `alignItems: "center"`

**内容结构**:
- 图标（左侧）: `width: 16px`, `height: 16px`, `fill: #9CA3AF`
- 占位符: `fontSize: 14px`, `fill: #9CA3AF`

### 统计卡片（Stat Card）

**属性**:
- 背景色: `#FFFFFF`
- 圆角: `12px`
- 内边距: `[20, 24px]`
- 阴影: `blur: 3px`, `offset: {x: 0, y: 1}`, `color: rgba(0,0,0,0.05)`
- 布局: `horizontal`, `gap: 16px`

**内容结构**:
- 图标背景: `width: 48px`, `height: 48px`, `cornerRadius: 10px`
  - 蓝色背景: `#EFF6FF`
  - 绿色背景: `#ECFDF5`
  - 红色背景: `#FEF2F2`
- 图标: `width: 24px`, `height: 24px`
- 内容区: `layout: "vertical"`, `gap: 4px`
  - 数值: `fontSize: 24px`, `fontWeight: 700`
  - 标签: `fontSize: 13px`, `fill: #6B7280`

### 表格（Table）

**容器属性**:
- 背景色: `#FFFFFF`
- 圆角: `12px`
- 内边距: `28px`
- 阴影: `blur: 3px`, `offset: {x: 0, y: 1}`, `color: rgba(0,0,0,0.05)`
- 布局: `vertical`, `gap: 8px`

**表头（Header Row）**:
- 底部边框: `1px solid #E5E7EB`
- 下边距: `12px`
- 布局: `horizontal`, `gap: 16px`
- 列宽示例:
  - 设备 ID: `280px`
  - 首次上报: `180px`
  - 最近上报: `180px`
  - 状态: `100px`
  - 操作: `120px`

**表头文本**:
- `fontSize: 12px`
- `fontWeight: 600`
- `fill: #6B7280`
- `letterSpacing: 0.5px`

**表格行（Row）**:
- 内边距: `16px`
- 圆角: `8px`
- 布局: `horizontal`, `gap: 16px`, `alignItems: "center"`

**斑马纹**: 偶数行背景色 `#F9FAFB`

### 状态徽章（Status Badge）

**在线状态**:
- 背景色: `#ECFDF5`
- 文字颜色: `#059669`
- 圆角: `20px`
- 内边距: `[6, 14px]`

**离线状态**:
- 背景色: `#F3F4F6`
- 文字颜色: `#6B7280`
- 圆角: `20px`
- 内边距: `[6, 14px]`

### 徽章胶囊（Pill Badge）

**健康状态徽章**:
- 背景色: `#10B981`
- 文字颜色: `#FFFFFF`
- 圆角: `20px`
- 内边距: `[6, 12px]`
- 内容: 状态点（`ellipse 8x8`）+ 文字

**错误状态徽章**:
- 背景色: `#EF4444`
- 文字颜色: `#FFFFFF`
- 圆角: `20px`
- 内边距: `[6, 12px]`
- 内容: 状态点（`ellipse 8x8`）+ 文字

### 骨架屏（Skeleton）

**属性**:
- 骨架颜色: `#F3F4F6`
- 骨架圆角: `4px`（矩形块）
- 骨架圆角: `12px`（徽章块）

**骨架表格行结构**:
- 设备 ID 骨架: `200px` × `16px`
- 时间字段骨架: `150px` × `16px`
- 状态徽章骨架: `80px` × `24px`（胶囊形状）
- 操作按钮骨架: `32px` × `32px`

**骨架统计卡片结构**:
- 图标背景: `48px` × `48px`（圆形）
- 数值骨架: `fill_container` × `28px`
- 标签骨架: `120px` × `16px`

### 空状态（Empty State）

**属性**:
- 容器宽度: `480px`
- 布局: `vertical`, `alignItems: "center"`
- 间距: `gap: 32px`

**内容结构**:
- 空状态图标背景: `120px` × `120px`, `cornerRadius: 60px`, `fill: #F3F4F6`
- 空状态图标: `inbox` (lucide), `48px` × `48px`, `fill: #9CA3AF`
- 标题: `fontSize: 24px`, `fontWeight: 600`, `fill: #111827`
- 描述: `fontSize: 14px`, `fill: #6B7280`, `textAlign: center`
- 操作按钮: 主按钮样式

### 错误状态（Error State）

**属性**:
- 容器宽度: `600px`
- 背景色: `#FFFFFF`
- 圆角: `12px`
- 内边距: `48px`
- 阴影: 卡片阴影
- 布局: `vertical`, `alignItems: "center"`
- 间距: `gap: 32px`

**内容结构**:
- 错误图标背景: `80px` × `80px`, `cornerRadius: 40px`, `fill: #FEF2F2`
- 错误图标: `alert-triangle` (lucide), `40px` × `40px`, `fill: #EF4444`
- 错误标题: `fontSize: 24px`, `fontWeight: 600`, `fill: #EF4444`
- 错误描述: `fontSize: 14px`, `fill: #6B7280`, `textAlign: center`
- 错误详情区:
  - 背景色: `#FEF2F2`
  - 圆角: `8px`
  - 内边距: `16px`
  - 布局: `vertical`, `gap: 8px`
  - 错误代码: `fontSize: 13px`, `fontWeight: 500`, `fill: #991B1B`
  - 错误时间: `fontSize: 13px`, `fill: #991B1B`
- 操作按钮: 主按钮（重试）+ 次要按钮（返回）

---

## 页面结构

### 标准页面布局（正常状态）

```
┌─────────────────────────────────────────────────────────┐
│  Header (64px)                                     │
│  [🌐/🌙] [EN/ZH]  [LOT] [页面标题]  [健康] [用户] │
│  [语言] [主题]  [Logo]                          [徽章] [菜单]           │
├──────┬──────────────────────────────────────────────────┤
│      │                                             │
│ Side │  Main Content                                │
│ bar  │  - Page Header (标题 + 副标题 + 按钮)        │
│ 151  │  - Search/Filter Bar                        │
│ px   │  - Stats Cards                              │
│      │  - Table / Content Area                      │
│      │                                             │
└──────┴───────────────────────────────────────────────┘
```

### 空状态布局（Empty State）

```
┌─────────────────────────────────────────────────────────┐
│  Header (64px)                                     │
│  [🌐/🌙] [EN/ZH]  [LOT] [页面标题]  [健康] [用户] │
│  [语言] [主题]  [Logo]                          [徽章] [菜单]           │
├──────┬──────────────────────────────────────────────────┤
│      │                                             │
│ Side │  主内容区域 (居中对齐)                        │
│ bar  │                                             │
│ 151  │         ┌─────────────────┐                 │
│ px   │         │   📦 空图标   │                 │
│      │         ├─────────────────┤                 │
│      │         │   暂无设备     │                 │
│      │         ├─────────────────┤                 │
│      │         │ 当前没有发现     │                 │
│      │         │ 任何设备...    │                 │
│      │         ├─────────────────┤                 │
│      │         │  [刷新列表]     │                 │
│      │         └─────────────────┘                 │
│      │                                             │
└──────┴───────────────────────────────────────────────┘
```

### 错误状态布局（Error State）

```
┌─────────────────────────────────────────────────────────┐
│  Header (64px)                                     │
│  [🌐/🌙] [EN/ZH]  [LOT] [页面标题]  [API Error] [用户] │
│  [语言] [主题]  [Logo]                          [徽章] [菜单]           │
├──────┬──────────────────────────────────────────────────┤
│      │                                             │
│ Side │  主内容区域 (居中对齐)                        │
│ bar  │                                             │
│ 151  │  ┌─────────────────────────────────────┐    │
│ px   │  │       ⚠️ 错误图标                │    │
│      │  ├─────────────────────────────────────┤    │
│      │  │           加载失败                  │    │
│      │  ├─────────────────────────────────────┤    │
│      │  │  无法加载设备列表，请检查           │    │
│      │  │  网络连接或稍后再试              │    │
│      │  ├─────────────────────────────────────┤    │
│      │  │  ┌─────────────────────────┐      │    │
│      │  │  │ 错误代码: ...      │      │    │
│      │  │  │ 时间: 2024-03-03  │      │    │
│      │  │  └─────────────────────────┘      │    │
│      │  ├─────────────────────────────────────┤    │
│      │  │  [重试]  [返回首页]             │    │
│      │  └─────────────────────────────────────┘    │
│      │                                             │
└──────┴───────────────────────────────────────────────┘
```

### 加载状态布局（Loading Skeleton）

```
┌─────────────────────────────────────────────────────────┐
│  Header (64px)                                     │
│  [🌐/🌙] [EN/ZH]  [LOT] [页面标题]  [API OK] [用户] │
│  [语言] [主题]  [Logo]                          [徽章] [菜单]           │
├──────┬──────────────────────────────────────────────────┤
│      │                                             │
│ Side │  主内容区域                                │
│ bar  │  - Page Header (标题 + 副标题 + [刷新])  │
│ 151  │  - Stats Cards (3个骨架卡片)                 │
│ px   │  - Table (骨架表格行)                      │
│      │                                             │
│      │  ┌─────┬─────┬─────┐               │
│      │  │ ▭▭ │ ▭▭ │ ▭▭ │  ← 骨架卡片 │
│      │  └─────┴─────┴─────┘               │
│      │                                             │
│      │  ┌──────────────────────────────────┐      │
│      │  │ ▭▭  ▭▭  ▭▭  ▭▭  ▭▭     │ ← 骨架表格行
│      │  ├──────────────────────────────────┤      │
│      │  │ ▭▭  ▭▭  ▭▭  ▭▭  ▭▭     │
│      │  └──────────────────────────────────┘      │
│      │                                             │
└──────┴───────────────────────────────────────────────┘
```

### 页面节点层级（示例：设备列表 qCJMC）

```
qCJMC (设备列表页面)
├── UiHe2 (页眉, 64px)
│   ├── TqTqQ (页眉左侧)
│   │   └── k0CoG (页面标题, 20px/600)
│   └── YwVbM (页眉右侧)
│       ├── vx2hB (健康状态徽章)
│       └── eYzDi (用户菜单)
├── R7JXO (内容包装器)
│   ├── x8rQd (侧边栏, 151px)
│   │   └── wcKyc (导航菜单)
│   └── TyIjy (主内容区域)
│       ├── nT08J (页眉操作栏)
│       ├── dcEvr (搜索过滤区)
│       ├── E3BRo (统计信息行)
│       └── i5iF8 (表格容器)
```

### 已知页面节点 ID

| 页面 | Node ID | 类型 | 描述 |
|------|----------|------|------|
| 仪表板 | `ZHgvC` | 亮色 | Dashboard 亮色主题 |
| 暗色仪表板 | `HhfXI` | 暗色 | Dashboard 暗色主题 |
| Topic 订阅配置 | `FJ5r5` | 亮色 | 订阅管理页面 |
| MQTT 代理 | `9xtLu` | 亮色 | MQTT 代理配置页面 |
| 设备列表 | `qCJMC` | 亮色 | 设备列表页面（正常状态） |
| 设备列表（加载中） | `V7DIc` | 亮色 | 设备列表页面（加载骨架屏） |
| 设备列表（空数据） | `wjykJ` | 亮色 | 设备列表页面（无数据状态） |
| 设备列表（失败状态） | `0Ic9x` | 亮色 | 设备列表页面（错误状态） |
| 登录页面 | `pa2eq` | 亮色 | 用户登录页面 |
| 未授权页面（403） | `ODO0p` | 亮色 | 403 Forbidden 错误页面 |
| 404 页面 | `6SAer` | 亮色 | 404 Not Found 错误页面 |

---

## 状态与交互

### 加载状态

- 表格区域: 骨架屏或加载指示器
- 按钮: 禁用状态，显示加载动画

### 空状态

- 无数据时显示: "暂无设备" 等提示
- 图标: 使用相关图标 + 提示文字

### 错误状态

- 网络错误: 显示错误提示 + 重试按钮
- 401/403: 提示权限问题

### 悬停状态

- 按钮: 轻微变深背景色
- 表格行: 鼠标悬停时背景色变化（可选）
- 链接/可点击图标: 颜色加深

---

## 图标规范

### 图标库

- **图标库**: `lucide`
- **使用方式**: `icon_font` 组件，指定 `iconFontName`

### 常用图标

| 图标名称 | 使用场景 |
|----------|----------|
| `layout-dashboard` | 仪表板 |
| `smartphone` | 设备、手机 |
| `rss` | Topic、订阅 |
| `inbox` | 空状态 |
| `alert-triangle` | 错误状态 |
| `layout-dashboard` | 返回首页 |
| `server` | MQTT 代理 |
| `settings` | 设置、环境配置 |
| `refresh-cw` | 刷新 |
| `download` | 导出 |
| `search` | 搜索 |
| `sliders-horizontal` | 过滤 |
| `eye` | 查看、详情 |
| `activity` | 活跃、在线 |
| `wifi-off` | 离线 |
| `moon` | 切换到暗色主题（亮色模式下显示） |
| `sun` | 切换到亮色主题（暗色模式下显示） |
| `globe` | 语言切换 |

### 图标尺寸

| 尺寸 | 使用场景 |
|------|----------|
| 12px | 小图标、装饰 |
| 16px | 按钮图标、输入框图标、导航图标 |
| 24px | 统计卡片图标 |

---

## 阴影与效果

### 卡片阴影

```javascript
effect: {
  type: "shadow",
  shadowType: "outer",
  offset: { x: 0, y: 1 },
  blur: 3,
  color: "rgba(0,0,0,0.05)"
}
```

### 状态徽章阴影（在线状态增强）

```javascript
effect: {
  type: "shadow",
  shadowType: "outer",
  offset: { x: 0, y: 1 },
  blur: 2,
  color: "rgba(16,185,129,0.15)"
}
```

---

## 响应式布局原则

### Flexbox 布局

- 主容器使用 `vertical` 或 `horizontal` 布局
- 子元素使用 `fill_container` 自适应宽度/高度
- 使用 `gap` 控制间距
- 使用 `justifyContent` 和 `alignItems` 控制对齐

### 尺寸行为

- `fill_container`: 填充父容器
- `fit_content`: 根据内容自动调整

---

## 代码生成建议

### CSS 类名映射

根据 `.pen` 文件中的组件属性，建议映射到 Tailwind CSS:

```css
/* 页面容器 */
.page-container {
  @apply min-h-screen bg-gray-50;
}

/* 顶栏 */
.header {
  @apply h-16 bg-white border-b border-gray-200;
}

/* 侧边栏 */
.sidebar {
  @apply w-36 bg-white border-r border-gray-200;
}

/* 导航项 */
.nav-item {
  @apply rounded-lg px-3 py-2.5 gap-2;
}

.nav-item--active {
  @apply bg-sky-50 text-sky-700;
}

/* 统计卡片 */
.stat-card {
  @apply bg-white rounded-xl p-5 shadow-sm;
}

/* 表格容器 */
.table-container {
  @apply bg-white rounded-xl p-7 shadow-sm;
}

/* 表格行 */
.table-row {
  @apply rounded-lg px-4 py-4;
}

.table-row--even {
  @apply bg-gray-50;
}

/* 状态徽章 */
.badge--online {
  @apply bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-1.5;
}

.badge--offline {
  @apply bg-gray-100 text-gray-600 rounded-full px-3.5 py-1.5;
}
```

---

## 维护说明

### 更新设计规范

当 `.pen` 文件中的设计发生变化时：

1. 使用 `mcp__pencil__batch_get` 获取最新节点数据
2. 分析新增/修改的组件
3. 更新本文档中的对应章节
4. 保持 Node ID 与实际设计稿同步

### Logo 组件

**属性**:
- 布局: `horizontal`, `gap: 16px`, `alignItems: "center"`
- Logo 文本: `fontSize: 24px`, `fontWeight: 700`, `fill: #3B82F6`
- 内容: "LOT"（项目名称）

**位置**:
- 所有页面的页眉左侧
- 与页面标题水平并排显示

**颜色变体**:
- 亮色主题: `#3B82F6`
- 暗色主题: `#60A5FA`

### 版本控制

本文档应与设计稿同步维护，建议在提交设计稿更新时一并更新此文档。

### 登录页面（Login Page）

**Node ID**: `pa2eq`

**属性**:
- 布局: `vertical`, `justifyContent: "center"`, `alignItems: "center"`
- 间距: `gap: 48px`
- 背景色: `#F9FAFB`

**内容结构**:
- Logo 图标背景: `64px` × `64px`, `cornerRadius: 16px`, `fill: #3B82F6`
- Logo 图标: `shield-check` (lucide), `32px` × `32px`, `fill: #FFFFFF`
- 页面标题: `fontSize: 32px`, `fontWeight: 600`, `fill: #111827`
- 副标题: `fontSize: 14px`, `fill: #6B7280`

**登录表单**:
- 容器背景: `#FFFFFF`, `cornerRadius: 8px`, `padding: 40px`
- 卡片阴影: `blur: 3px`, `offset: {x: 0, y: 1}`, `color: rgba(0,0,0,0.05)`
- 间距: `gap: 20px`

**输入框**:
- 标签: `fontSize: 14px`, `fontWeight: 500`, `fill: #374151`
- 输入框: `stroke: 1px solid #E5E7EB`, `cornerRadius: 8px`, `padding: [10, 16px]`
- 占位符: `fontSize: 14px`, `fill: #9CA3AF`

**按钮**:
- 主按钮（登录）: `fill: #3B82F6`, 文字 `#FFFFFF`, `cornerRadius: 8px`
- 次要按钮（返回）: `fill: #FFFFFF`, 文字 `#374151`, 边框 `1px solid #E5E7EB`

### 未授权页面（403 Forbidden）

**Node ID**: `ODO0p`

**属性**:
- 布局: `vertical`, `justifyContent: "center"`, `alignItems: "center"`
- 间距: `gap: 48px`
- 背景色: `#FFFFFF`

**内容结构**:
- 错误图标背景: `120px` × `120px`, `cornerRadius: 60px`, `fill: #FEF2F2`
- 错误图标: `lock` (lucide), `56px` × `56px`, `fill: #EF4444`
- 错误代码: `fontSize: 72px`, `fontWeight: 700`, `fill: #EF4444`
- 错误标题: `fontSize: 24px`, `fontWeight: 600`, `fill: #111827`
- 错误描述: `fontSize: 16px`, `fill: #6B7280`
- 错误详情: `fontSize: 14px`, `fill: #9CA3AF`

### 404 页面（Not Found）

**Node ID**: `6SAer`

**属性**:
- 布局: `vertical`, `justifyContent: "center"`, `alignItems: "center"`
- 间距: `gap: 48px`
- 背景色: `#FFFFFF`

**内容结构**:
- 图标背景: `120px` × `120px`, `cornerRadius: 60px`, `fill: #F3F4F6`
- 图标: `search-x` (lucide), `56px` × `56px`, `fill: #64748B`
- 错误代码: `fontSize: 72px`, `fontWeight: 700`, `fill: #EF4444`
- 错误标题: `fontSize: 24px`, `fontWeight: 600`, `fill: #111827`
- 错误描述: `fontSize: 16px`, `fill: #6B7280`

**建议列表**:
- 容器宽度: `400px`, 布局: `vertical`, `gap: 12px`, `alignItems: "center"`
- 标题: `fontSize: 14px`, `fontWeight: 500`, `fill: #374151`
- 列表项: `fontSize: 14px`, `fill: #6B7280`

### MQTT 代理页面（MQTT Broker）

**Node ID**: `9xtLu`

**属性**:
- 布局: `horizontal`
- 背景色: `#F9FAFB`

**页面结构**:
- 顶栏 (64px): 包含页面标题 "MQTT 代理"
- 侧边栏 (151px): 导航菜单，MQTT 代理项为激活状态
- 主内容区域: `vertical`, `padding: 32px`, `gap: 24px`

**主内容区域**:
- 页面标题区: 包含主标题 "MQTT 代理配置" 和副标题描述
- 统计卡片行: 3 个统计卡片（活跃连接、消息/秒、活跃 Topic）
- 配置表格: 显示 MQTT 代理配置项（监听端口、最大连接数、心跳间隔、QoS、Retain 消息等）
- 操作栏: 包含"重启服务"和"编辑配置"按钮

**统计卡片**:
- 卡片 1 - 活跃连接: 蓝色图标背景 `#EFF6FF`, 图标 `link`, 数值 "1,234"
- 卡片 2 - 消息/秒: 绿色图标背景 `#ECFDF5`, 图标 `activity`, 数值 "8,456"
- 卡片 3 - 活跃 Topic: 红色图标背景 `#FEF2F2`, 图标 `rss`, 数值 "567"

**配置表格**:
- 表头: 配置项、值
- 行样式: `padding: 16px`, `cornerRadius: 8px`
- 配置项示例: 监听端口 (1883)、最大连接数 (10000)、心跳间隔 (60s)、QoS 默认值 (1)、Retain 消息 (启用)

**操作按钮**:
- 重启服务: 红色按钮 `#EF4444`, 图标 `refresh-cw`
- 编辑配置: 白色按钮，带边框，图标 `settings`

---

**最后更新**: 2026-03-03
**对应设计稿**: `LOT.pen` (Nodes: ZHgvC, HhfXI, FJ5r5, 9xtLu, qCJMC, V7DIc, wjykJ, 0Ic9x, pa2eq, ODO0p, 6SAer)
