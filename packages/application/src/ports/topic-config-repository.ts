import type { TopicSubscription } from "@lot/domain";

export interface TopicConfigRepository {
  findAllEnabled(): Promise<TopicSubscription[]>;
  findAll(): Promise<TopicSubscription[]>;
  create(sub: Omit<TopicSubscription, "id" | "createdAt">): Promise<TopicSubscription>;
  update(
    id: string,
    patch: Partial<Pick<TopicSubscription, "name" | "pattern" | "enabled" | "notes">>,
  ): Promise<TopicSubscription | null>;
  delete(id: string): Promise<boolean>;
}
