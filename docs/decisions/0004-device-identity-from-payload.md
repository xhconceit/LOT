# ADR-0004：设备识别来自 payload（而非 Topic）

## 状态

已采纳（Accepted）

## 背景

本项目的订阅 Topic 由用户在后台配置，Topic 名称无法可靠表达“属于哪个设备”。如果仍尝试从 Topic 推断设备，会导致：

- 规则不一致（不同用户/不同环境 topic 命名差异大）
- 解析失败率高、维护成本高

## 决策

设备归属以 payload 内的 `deviceId` 为准：

- 每条消息 payload **必须**包含 `deviceId`
- 缺失/非法 `deviceId` 的消息不入库

Topic 不承载业务语义，仅用于订阅过滤与来源标记（见 `docs/data-spec.md`）。

## 影响

- **正面**：订阅/Topic 更自由；数据归属规则更稳定
- **代价**：需要设备侧统一上报 `deviceId`；接入时必须校验与治理脏数据

## 参考

- `docs/data-spec.md`
