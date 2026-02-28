import type { TelemetryRecord } from "@lot/domain";

import type { TelemetryRepository } from "../ports/telemetry-repository";

export interface QueryTelemetryInput {
  deviceId: string;
  limit?: number;
  offset?: number;
}

export class QueryTelemetry {
  constructor(private readonly telemetry: TelemetryRepository) {}

  async execute(input: QueryTelemetryInput): Promise<TelemetryRecord[]> {
    return this.telemetry.findByDevice(input.deviceId, {
      limit: input.limit,
      offset: input.offset,
    });
  }
}
