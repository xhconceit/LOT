// 遥测记录实体
export interface TelemetryRecord {
  // 记录唯一标识
  id: string;
  // 设备唯一标识
  deviceId: string;
  // 时间戳
  ts: Date;
  // 主题
  topic: string;
  // 消息类型
  type?: string;
  // 原始负载
  payloadRaw: Record<string, unknown>;
  // 入库时间
  ingestedAt: Date;
}
