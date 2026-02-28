import type { TelemetryRecord } from "@lot/domain";

export interface TelemetryRepository {
  insert(deviceId: string, record: Omit<TelemetryRecord, "id" | "ingestedAt">): Promise<void>;
  findByDevice(
    deviceId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TelemetryRecord[]>;
}
