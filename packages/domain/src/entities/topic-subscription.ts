// 主题订阅实体
export interface TopicSubscription {
  // 订阅唯一标识
  id: string;
  // 订阅名称
  name: string;
  // 订阅模式
  pattern: string;
  // 是否启用
  enabled: boolean;
  // 备注
  notes?: string;
  // 创建时间
  createdAt: Date;
}
