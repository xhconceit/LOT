---
description: 当分支发生分歧（超前/落后）时，从远程更新 LOT 。
---

# LOT 远程分支同步工作流程

当本地分支与远程分支出现分歧时（例如， "18 commits ahead, 29 commits behind" ）,请使用此工作流程。

## 快速参考

```bash
# 查看分歧状态
git fetch origin && git rev-list --left-right --count main...origin/main

# 完全同步（首选重基）
git fetch main && git rebase origin/main && pnpm install && pnpm build
```

---

## Step 0：安全垫（强烈建议）

在你开始同步/变基前，先把“可回滚”和“工作区干净”做好。

```bash
# 确认在 main（或你要同步的目标分支）
git switch main

# 确保工作区干净（否则先提交，或临时 stash）
git status
# 可选：临时保存未提交改动（包含未跟踪文件）
git stash push -u -m "WIP: before sync"

# 本地做一个备份分支，方便随时回滚
git branch "backup/main-before-sync-$(date +%Y%m%d-%H%M%S)"

# 获取远程最新引用（顺便清理已删除分支的引用）
git fetch origin --prune
```

## 步骤 1：评估分歧

```bash
git fetch origin
git log --oneline --left-right main...origin/main | head -20
```

由此可见：

- `<`：仅在左侧分支（`main`）存在的提交（你领先的部分）
- `>`：仅在右侧分支（`origin/main`）存在的提交（你落后的部分）


**决策点（怎么选 Rebase / Merge）：**

- **先问自己一个关键问题**：这个分支（尤其是 `main`）是否为**共享分支 / 受保护分支**，并且“禁止改写历史（force push）”？
  - **是** -> 选 **Merge**（或用 PR 合并），不要 rebase + 强推
  - **否** -> 继续往下看
- **你的本地提交是否已经发布给别人使用**（例如已经推到远程、已经被别人基于它开发、或已经进入评审/CI）？
  - **是** -> 选 **Merge**（避免改写已发布历史导致他人分支/PR 混乱）
  - **否** -> 选 **Rebase**（你在本地的未发布提交，重放到 `origin/main` 上更干净）
- **不确定就选**：**Merge**（更稳、更不容易“误伤”别人）

> 注意：选择 **Rebase** 同步 `main` 通常意味着需要 `git push --force-with-lease`；只有在你确认允许强推且已协商的情况下才这么做。

## 步骤 2A：重新定基策略（首选）

在远程提交的基础上重放你的提交，从而形成线性历史记录。

```bash
# 确保工作树清洁
git status

# 在主线上进行变基
git rebase origin/main
```

### 处理变基冲突

```bash
# 发生冲突时：
# 1. 修复列出的文件中的冲突
# 2. 暂存已解决的文件
git add <resolved-files>

# 3. 继续变基
git rebase --continue

# 如果不再需要某个提交（已在远程）：
git rebase --skip

# 中止并返回到原始状态：
git rebase --abort
```

### 常见冲突模式

| 文件 | 解决方式 |
| ---- | -------- |
| `package.json` | 需要时，请保留远程依赖项和本地脚本。 |
| `pnpm-lock.yaml` | 接受远程指令，使用 `pnpm install` 重新生成 |
| `*.patch` 文件 | 通常采用远程版本 |
| 源文件 | 合并逻辑要谨慎，优先考虑远程结构。 | 

---

## 步骤 2B：合并策略（备选方案）

合并提交会保留所有历史记录。

```bash
git merge origin/main --no-edit
```

然后，以与 rebase 相同的方式解决冲突：

```bash
git add <resolved-files>
git commit
```

---

## 步骤 3：重建一切

同步完成后：

```bash
# 安装依赖项（必要时重新生成锁）
pnpm install
# Build
pnpm build
```

## 步骤 4：验证并推送

```bash
# 测试
pnpm test

# 推送（重新变基）
git push origin main --force-with-lease

# 或者合并后进行常规推送
git push origin main
```

---


## 故障排除

### 同步后构建失败

```bash
# 清除依赖重新编译
rm -rf node_modules dist
pnpm install
pnpm build
```

### 类型错误（Bun/Node 不兼容）

常见问题： `fetch.preconnect` 类型不匹配。解决方法是使用 `FetchLike` 类型而不是 `typeof fetch` 。

## 自动化脚本

另存为 `scripts/sync-origin.sh`。

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "==> 获取远程数据"
git fetch origin

echo "==> 当前分歧："
git rev-list --left-right --count main...origin/main

echo "==> 重新变基到 origin/main..."
git rebase origin/main

echo "==> 安装依赖中..."
pnpm install

echo "==> 编译..."
pnpm build

echo "===> 完成！准备就绪后运行“git push --force-with-lease”"

```

