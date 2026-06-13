import type { TopicSubscription } from "@lot/domain";

export interface TopicConfigRepository {
  // 查询所有启用的订阅 
  findAllEnabled(): Promise<TopicSubscription[]>;
  // 查询所有订阅
  findAll(): Promise<TopicSubscription[]>;
  // 创建订阅
  create(sub: Omit<TopicSubscription, "id" | "createdAt">): Promise<TopicSubscription>;
  // 更新订阅
  update(id: string, patch: Partial<Pick<TopicSubscription, "name" | "pattern" | "enabled" | "notes">>): Promise<TopicSubscription | null>;
  // 删除订阅
  delete(id: string): Promise<boolean>;
}
