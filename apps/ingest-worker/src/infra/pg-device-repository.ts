import type { DeviceRepository } from "@lot/application";
import type { Device } from "@lot/domain";
import type postgres from "postgres";

export class PgDeviceRepository implements DeviceRepository {
  constructor(private readonly sql: postgres.Sql) {}

  async findAll(options?: { limit?: number; offset?: number }): Promise<Device[]> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const rows = await this.sql`
      SELECT device_id, first_seen_at, last_seen_at, table_name
      FROM devices
      ORDER BY last_seen_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows.map(toDevice);
  }

  async findById(deviceId: string): Promise<Device | null> {
    const rows = await this.sql`
      SELECT device_id, first_seen_at, last_seen_at, table_name
      FROM devices WHERE device_id = ${deviceId}
    `;
    return rows.length > 0 ? toDevice(rows[0]) : null;
  }

  async upsert(deviceId: string): Promise<Device> {
    const tableName = `telemetry_${deviceId.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 60)}`;
    const rows = await this.sql`
      INSERT INTO devices (device_id, table_name)
      VALUES (${deviceId}, ${tableName})
      ON CONFLICT (device_id) DO UPDATE SET last_seen_at = now()
      RETURNING device_id, first_seen_at, last_seen_at, table_name
    `;
    return toDevice(rows[0]);
  }
}

function toDevice(r: postgres.Row): Device {
  return {
    deviceId: String(r.device_id),
    firstSeenAt: new Date(r.first_seen_at as string),
    lastSeenAt: new Date(r.last_seen_at as string),
    tableName: String(r.table_name),
  };
}
