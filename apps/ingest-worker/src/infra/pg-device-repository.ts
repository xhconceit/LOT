import type { DeviceRepository } from "@lot/application";
import type { Device } from "@lot/domain";
import type postgres from "postgres";

export class PgDeviceRepository implements DeviceRepository {
  constructor(private readonly sql: postgres.Sql) {}

  // 查询所有设备
  async findAll(options?: { limit?: number; offset?: number }): Promise<Device[]> {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    const rows = await this.sql`
      SELECT device_id, first_seen_at, last_seen_at
      FROM devices
      ORDER BY last_seen_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows.map(toDevice);
  }

  // 查询单个设备
  async findById(deviceId: string): Promise<Device | null> {
    const rows = await this.sql`
      SELECT device_id, first_seen_at, last_seen_at
      FROM devices WHERE device_id = ${deviceId}
    `;
    return rows.length > 0 ? toDevice(rows[0]) : null;
  }

  // 插入或更新设备
  async upsert(deviceId: string): Promise<Device> {
    const rows = await this.sql`
      INSERT INTO devices (device_id)
      VALUES (${deviceId})
      ON CONFLICT (device_id) DO UPDATE SET last_seen_at = now()
      RETURNING device_id, first_seen_at, last_seen_at
    `;
    return toDevice(rows[0]);
  }
}

function toDevice(r: postgres.Row): Device {
  return {
    deviceId: String(r.device_id),
    firstSeenAt: new Date(r.first_seen_at as string),
    lastSeenAt: new Date(r.last_seen_at as string),
  };
}
