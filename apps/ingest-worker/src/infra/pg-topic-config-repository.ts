import type { TopicConfigRepository } from '@lot/application'
import type { TopicSubscription } from '@lot/domain'
import type postgres from 'postgres'



// 主题配置仓库实现
export class PgTopicConfigRepository implements TopicConfigRepository {
    // 构造函数
    constructor(private readonly sql: postgres.Sql) {}

    async findAllEnabled(): Promise<TopicSubscription[]> {
        const rows = await this.sql`
            SELECT id, name, pattern, enabled, notes, created_at
            FROM topic_subscriptions
            WHERE enabled = true
            ORDER BY created_at DESC
        `
        return rows.map(toTopicSubscription)
    }
    async findAll(): Promise<TopicSubscription[]> {
        throw new Error('Not implemented')
    }
    async create(sub: Omit<TopicSubscription, 'id'|'createdAt'>): Promise<TopicSubscription> {
        throw new Error('Not implemented')
    }
    async update(id: string, patch: Partial<Pick<TopicSubscription, "name" | "pattern" | "enabled" | "notes">>): Promise<TopicSubscription|null> {
        throw new Error("Not implemented")
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Not implemented")
    }


    
}

function toTopicSubscription(r: postgres.Row): TopicSubscription {
    return {
        id: String(r.id),
        name: String(r.name),
        pattern: String(r.pattern),
        enabled: Boolean(r.enabled),
        notes: r.notes ? String(r.notes): undefined,
        createdAt: new Date(r.created_at as string),
    }
}