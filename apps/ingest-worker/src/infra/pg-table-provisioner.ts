import type { TableProvisioner } from "@lot/application";
import type postgres from "postgres";

export class PgTableProvisioner implements TableProvisioner {
  private readonly created = new Set<string>();

  constructor(private readonly sql: postgres.Sql) {}

  async ensureTable(deviceId: string): Promise<void> {
    const tableName = `telemetry_${sanitizeId(deviceId)}`;

    if (this.created.has(tableName)) {
      return
    };

    await this.sql.unsafe(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        device_id     TEXT        NOT NULL,
        ts            TIMESTAMPTZ NOT NULL,
        topic         TEXT        NOT NULL,
        type          TEXT,
        payload_raw   JSONB       NOT NULL DEFAULT '{}',
        ingested_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await this.sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_${tableName}_ts ON ${tableName} (ts DESC)
    `);

    this.created.add(tableName);
    console.log("🔧 表已就绪:", tableName);
  }
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 60);
}
