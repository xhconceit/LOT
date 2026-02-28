export interface TelemetryRecord {
  id: string;
  deviceId: string;
  ts: Date;
  topic: string;
  type?: string;
  payloadRaw: Record<string, unknown>;
  ingestedAt: Date;
}
