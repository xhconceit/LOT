import type { DeviceRepository } from "../ports/device-repository";
import type { TableProvisioner } from "../ports/table-provisioner";
import type { TelemetryRepository } from "../ports/telemetry-repository";

export interface IngestTelemetryInput {
  deviceId: string;
  topic: string;
  ts?: number;
  type?: string;
  payloadRaw: Record<string, unknown>;
}

export class IngestTelemetry {
  constructor(
    private readonly devices: DeviceRepository,
    private readonly tables: TableProvisioner,
    private readonly telemetry: TelemetryRepository,
  ) {}

  async execute(input: IngestTelemetryInput): Promise<void> {
    await this.devices.upsert(input.deviceId);
    await this.tables.ensureTable(input.deviceId);
    await this.telemetry.insert(input.deviceId, {
      deviceId: input.deviceId,
      ts: input.ts ? new Date(input.ts) : new Date(),
      topic: input.topic,
      type: input.type,
      payloadRaw: input.payloadRaw,
    });
  }
}
