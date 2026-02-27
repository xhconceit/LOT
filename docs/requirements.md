# 需求清单（迭代用）

用 Must / Should / Could 标注优先级，便于拆里程碑与验收。

## Must（必须）

- **MQTT 订阅**：可配置 Broker 与订阅 Topic（Topic/Pattern 由后台配置，不硬编码）
- **Topic 处理**：Topic 不承载语义，不做解析；但必须保留原始 topic 用于追溯（见 `docs/data-spec.md`）
- **设备识别**：从 payload 的 `deviceId` 确定设备归属（Topic 不承载设备信息）
- **设备控制（控制面）**：小程序/APP 通过 HTTP API 下发控制命令，由后端 publish MQTT 到设备并处理回执（见 `docs/control-spec.md`）
- **入库**：写入 PostgreSQL
- **设备自动建表**：新设备首次上报自动创建对应存储结构
- **基础可视化**：至少能看到最近数据与基础趋势
- **工程化**：lint/format/test 有统一命令且可在 CI 中跑通

## Should（应该）

- **失败处理**：解析失败/入库失败有可追溯日志与重试策略
- **索引与查询性能**：常用查询具备合理索引
- **历史查询**：按时间范围、`type`、`topic` 等过滤（按 `deviceId` 聚合/统计）
- **实时刷新**：UI 能实时刷新（WebSocket/SSE 任选）

## Could（可以）

- **设备管理页**：列出已发现设备（按 `deviceId`）
- **Topic/类型维度**：按 `topic` / `type` 做统计与筛选
- **告警**：阈值告警与通知（邮件/Webhook）
- **数据导出**：CSV/JSON 导出

