# ADR-0001：MQTT Topic 不承载业务语义

## 状态

提议（Draft）

## 背景

Topic 由用户在后台配置，且实际场景中 topic 名称无法稳定表达设备/部件/指标等语义。

同时，由于 Topic 由后台配置且不包含设备信息，**设备归属由 payload 的 `deviceId` 决定**。

## 决策

Topic **不承载业务语义**：

- 不从 topic 推断 device/part/metric/type
- 入库时保留原始 topic 作为来源信息（用于追溯与排障）

设备归属不从 Topic 推断，改为强制要求 payload 提供 `deviceId`（见 `docs/data-spec.md`）。

## 影响

- **正面**：对接成本最低；与“后台配置订阅 pattern”一致；避免脆弱的 topic 解析
- **代价**：所有业务语义必须来自 payload；需对缺失/非法 deviceId 做严格拒收与告警

## 参考

- 数据规范：`docs/data-spec.md`
