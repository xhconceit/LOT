# ADR-0003：采用清洁架构（Clean Architecture）

## 状态

已采纳（Accepted）

## 背景

项目将同时包含 MQTT 采集、数据库写入、API 查询与 Web 可视化，后续还会扩展更多需求。需要一种架构约束来：

- 控制模块边界与依赖方向
- 提升可测试性（尤其是用例层与领域层）
- 降低框架/驱动变更的影响（例如替换 DB、替换 MQTT 客户端、调整 API 形态）

## 决策

采用清洁架构四层：

- Entities（领域实体）
- Use Cases（应用用例）
- Interface Adapters（接口适配层）
- Frameworks & Drivers（框架/驱动/基础设施）

并强制遵守“依赖只能从外向内”的依赖规则。实现细则见 `docs/architecture.md`。

## 影响

- **正面**：边界清晰、可测试、可演进；领域与用例不被 Next.js/DB/MQTT 绑死
- **代价**：初期需要更多样板代码（Ports/DTO/映射）；团队需持续遵守约定

## 参考

- `docs/architecture.md`

