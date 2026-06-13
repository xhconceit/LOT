import type { Sql } from 'postgres'


export async function runMigrations(sql: Sql) {

    await sql.unsafe(`
  CREATE TABLE IF NOT EXISTS devices (
    device_id      TEXT PRIMARY KEY,
    first_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`);
    await sql.unsafe(`
  ALTER TABLE devices
  DROP COLUMN IF EXISTS table_name
`);
    console.log("✅ devices 表已就绪");

    await sql.unsafe(`
  CREATE TABLE IF NOT EXISTS topic_subscriptions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    pattern     TEXT NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT true,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`);

    await sql.unsafe(`
  CREATE INDEX IF NOT EXISTS idx_topic_subscriptions_enabled
  ON topic_subscriptions (enabled)
`);

    console.log("✅ topic_subscriptions 表已就绪");

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        device_id     TEXT        NOT NULL,
        ts            TIMESTAMPTZ NOT NULL,
        topic         TEXT        NOT NULL,
        type          TEXT,
        payload_raw   JSONB       NOT NULL DEFAULT '{}',
        ingested_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);


    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_device_ts ON telemetry (device_id, ts DESC)
    `);

    console.log("✅ telemetry 表已就绪");

}