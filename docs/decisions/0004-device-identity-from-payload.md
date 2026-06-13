# ADR-0004：设备识别优先来自 payload，缺失时回退 clientId（而非 Topic）

## 状态

已采纳（Accepted）

## 背景

本项目的订阅 Topic 由用户在后台配置，Topic 名称无法可靠表达“属于哪个设备”。如果仍尝试从 Topic 推断设备，会导致：

- 规则不一致（不同用户/不同环境 topic 命名差异大）
- 解析失败率高、维护成本高

## 决策

设备归属按以下优先级确定：

- 优先使用 payload 内的 `deviceId`
- 若 payload 缺失 `deviceId`，则回退 MQTT `clientId`
- 若两者同时存在且不一致，以 payload 内的 `deviceId` 为准，并记录 warning 便于排障
- 若无法得到合法的设备标识（payload `deviceId` 非法，或 payload 与 `clientId` 均缺失/非法），则消息不入库

Topic 不承载业务语义，仅用于订阅过滤与来源标记（见 `docs/data-spec.md`）。

## 影响

- **正面**：订阅/Topic 更自由；允许未显式上报 `deviceId` 的设备先接入；数据归属规则仍集中在消息内容/连接上下文中
- **代价**：需要在入库链路中获取发布方 MQTT `clientId`；接入时必须处理 `payload.deviceId` 与 `clientId` 冲突及脏数据治理

## 参考

- `docs/data-spec.md`
