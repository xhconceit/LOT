export interface TopicSubscription {
  id: string;
  name: string;
  pattern: string;
  enabled: boolean;
  notes?: string;
  createdAt: Date;
}
