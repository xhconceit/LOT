# ADR-0014：Topic 过滤在 ingest-worker 侧执行

## 状态

已采纳（Accepted）

## 背景

`topic_subscriptions` 表存储用户配置的订阅 pattern。需要决定在哪一层对消息做 topic 匹配过滤：

- **方案 A（ingest-worker 过滤）**：broker 转发所有消息，ingest-worker 收到后按 pattern 过滤
- **方案 B（broker 过滤）**：broker 启动时读取配置，只转发匹配 pattern 的消息

## 决策

采用 **方案 A**：在 ingest-worker 侧过滤。

理由：

1. broker 保持纯粹的"连接/发布/订阅"职责，不承担业务过滤，不连接数据库
2. 实现简单，配置变更只需 ingest-worker 刷新
3. broker 转发全量消息，便于将来扩展其他消费者（审计、日志、告警等）
4. 当前消息量不大，全量转发的开销可以忽略

## 后续改进方向

当消息量增长到全量转发成为性能瓶颈时，可切换为方案 B：

- broker 启动时从数据库加载已启用的 pattern
- `aedes.on("publish")` 中只转发匹配 pattern 的消息到 `__internal__/ingest`
- broker 需要增加配置刷新机制（定时拉取或监听变更通知）
- 需评估 broker 连接数据库带来的复杂度与可靠性影响

## 影响

- **正面**：架构简单，broker 无状态，易于部署和扩缩容
- **代价**：全量转发在大流量场景下有额外开销

## 参考

- `docs/data-spec.md` §1.4（Topic 由后台配置）
- `docs/architecture.md` §2（服务拆分）
