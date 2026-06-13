# ADR-0001：MQTT Topic 不承载业务语义

## 状态

提议（Draft）

## 背景

Topic 由用户在后台配置，且实际场景中 topic 名称无法稳定表达设备/部件/指标等语义。

同时，由于 Topic 由后台配置且不包含设备信息，**设备归属优先由 payload 的 `deviceId` 决定；缺失时回退 MQTT `clientId`**。

## 决策

Topic **不承载业务语义**：

- 不从 topic 推断 device/part/metric/type
- 入库时保留原始 topic 作为来源信息（用于追溯与排障）

设备归属不从 Topic 推断，改为按以下优先级解析（见 `docs/data-spec.md`）：

- 优先使用 payload 提供的 `deviceId`
- 若 payload 缺失 `deviceId`，则回退 MQTT `clientId`

## 影响

- **正面**：对接成本最低；与“后台配置订阅 pattern”一致；避免脆弱的 topic 解析
- **代价**：需要从 Broker 侧或消息上下文拿到 `clientId`；并处理 `payload.deviceId` 与 `clientId` 不一致时的治理策略

## 参考

- 数据规范：`docs/data-spec.md`
