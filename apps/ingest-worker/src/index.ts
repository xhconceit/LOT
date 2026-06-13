import { config } from "./config";
import postgres from "postgres";
import { createMqttHandler } from "./adapters/mqtt-handler";
import { runMigrations } from "./infra/migrations";
import { buildContainer } from "./composition-root";
import { createMqttClient } from "./infra/mqtt-client";
import { TopicSubscription } from "@lot/domain";

const init = async () => {
  const sql = postgres(config.databaseUrl);
  await runMigrations(sql);
  const { ingestTelemetry } = buildContainer(sql)


  let subscriptions: TopicSubscription[] = [];

  console.log("🔍 加载主题订阅:", subscriptions.map(s => s.pattern).join(", "));

  if (subscriptions.length === 0) {
    console.warn("🔍 没有主题订阅，将不接收任何消息");
  }

  const handler = createMqttHandler(ingestTelemetry, () => subscriptions);




  const { shutdown: shutdownMqtt } = createMqttClient({
    url: config.mqttUrl,
    onMessage: handler,
  })

  const shutdown = () => {
    shutdownMqtt(() => {
      sql.end().then(() => {
        console.log("✅ Ingest Worker 已关闭");
        process.exit(0);
      });
    })
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

}

init()