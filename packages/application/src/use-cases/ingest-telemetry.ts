import type { DeviceRepository } from "../ports/device-repository";
import type { TelemetryRepository } from "../ports/telemetry-repository";

export interface IngestTelemetryInput {
  deviceId: string;
  topic: string;
  ts?: number;
  type?: string;
  payloadRaw: Record<string, unknown>;
}

// 遥测使用 case
export class IngestTelemetry {
  constructor(
    private readonly devices: DeviceRepository,
    private readonly telemetry: TelemetryRepository,
  ) {}

  // 执行遥测使用 case
  async execute(input: IngestTelemetryInput): Promise<void> {
    await this.devices.upsert(input.deviceId);
    await this.telemetry.insert({
      deviceId: input.deviceId,
      ts: input.ts ? new Date(input.ts) : new Date(),
      topic: input.topic,
      type: input.type,
      payloadRaw: input.payloadRaw,
    });
  }
}
