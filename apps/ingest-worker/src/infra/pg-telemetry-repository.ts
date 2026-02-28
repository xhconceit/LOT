import type { TelemetryRepository } from "@lot/application";
import type { TelemetryRecord } from "@lot/domain";
import type postgres from "postgres";

export class PgTelemetryRepository implements TelemetryRepository {
  constructor(private readonly sql: postgres.Sql) {}

  async insert(
    deviceId: string,
    record: Omit<TelemetryRecord, "id" | "ingestedAt">,
  ): Promise<void> {
    const tableName = `telemetry_${sanitizeId(deviceId)}`;
    await this.sql`
      INSERT INTO ${this.sql(tableName)} (device_id, ts, topic, type, payload_raw)
      VALUES (${record.deviceId}, ${record.ts}, ${record.topic}, ${record.type ?? null}, ${JSON.stringify(record.payloadRaw)})
    `;
  }

  async findByDevice(
    deviceId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TelemetryRecord[]> {
    const tableName = `telemetry_${sanitizeId(deviceId)}`;
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const rows = await this.sql`
      SELECT id, device_id, ts, topic, type, payload_raw, ingested_at
      FROM ${this.sql(tableName)}
      ORDER BY ts DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows.map((r) => ({
      id: String(r.id),
      deviceId: String(r.device_id),
      ts: new Date(r.ts as string),
      topic: String(r.topic),
      type: r.type ? String(r.type) : undefined,
      payloadRaw: r.payload_raw as Record<string, unknown>,
      ingestedAt: new Date(r.ingested_at as string),
    }));
  }
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 60);
}
