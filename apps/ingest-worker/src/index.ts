import { IngestTelemetry } from "@lot/application";
import mqtt from "mqtt";
import postgres from "postgres";

import { createMqttHandler } from "./adapters/mqtt-handler";
import { PgDeviceRepository } from "./infra/pg-device-repository";
import { PgTableProvisioner } from "./infra/pg-table-provisioner";
import { PgTelemetryRepository } from "./infra/pg-telemetry-repository";

const databaseUrl = process.env.DATABASE_URL ?? "postgres://lot:lot_secret@localhost:5432/lot";
const mqttUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";

const sql = postgres(databaseUrl);

await sql.unsafe(`
  CREATE TABLE IF NOT EXISTS devices (
    device_id      TEXT PRIMARY KEY,
    first_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    table_name     TEXT NOT NULL
  )
`);
console.log("✅ devices 表已就绪");

const deviceRepo = new PgDeviceRepository(sql);
const tableProvisioner = new PgTableProvisioner(sql);
const telemetryRepo = new PgTelemetryRepository(sql);

const ingestTelemetry = new IngestTelemetry(deviceRepo, tableProvisioner, telemetryRepo);
const handler = createMqttHandler(ingestTelemetry);

const client = mqtt.connect(mqttUrl);

client.on("connect", () => {
  console.log(`🚀 Ingest Worker 已连接 MQTT: ${mqttUrl}`);
  client.subscribe("#", (err) => {
    if (err) {
      console.error("❌ 订阅失败:", err);
    } else {
      console.log("📡 已订阅所有 Topic (#)");
    }
  });
});

client.on("message", (topic, payload) => {
  handler(topic, payload).catch((err) => {
    console.error("❌ 处理消息失败:", err);
  });
});

client.on("error", (err) => {
  console.error("❌ MQTT 连接错误:", err);
});

function shutdown() {
  console.log("⏹️ 正在关闭 Ingest Worker...");
  client.end(false, () => {
    sql.end().then(() => {
      console.log("✅ Ingest Worker 已关闭");
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
