# ADR-0005：Topic 无语义，语义来自 payload

## 状态

已采纳（Accepted）

## 背景

实际数据接入中：

- Topic 由用户在后台配置，命名不可控
- Topic 无法可靠表达设备、部件或指标

若强行解析 Topic 会导致实现脆弱、维护成本高。

## 决策

- Topic **不承载业务语义**，仅作为订阅过滤与来源标记
- 业务语义（至少 `deviceId`，以及可选 `type`/`data`）来自 payload
- 入库必须保留原始 topic

## 影响

- **正面**：接入成本低；兼容性强
- **代价**：需要设备侧/上游在 payload 中提供可用字段；脏数据治理更重要

## 参考

- `docs/data-spec.md`

