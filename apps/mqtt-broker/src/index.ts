import { createServer } from "node:net";
import { type IngestEnvelope } from "@lot/shared";
import { Aedes } from "aedes";
const INGEST_TOPIC = "__internal__/ingest";
const port = Number(process.env.MQTT_PORT) || 1883;

const aedes = await Aedes.createBroker();
const server = createServer(aedes.handle);

aedes.on("client", (client) => {
  console.log("🔗 客户端连接:", client.id);
});

aedes.on("clientDisconnect", (client) => {
  console.log("⛔ 客户端断开:", client.id);
});

aedes.on("publish", (packet, client) => {
  if (!client) {
    return
  }
  if (packet.topic === INGEST_TOPIC) {
    return
  }

  console.log("📤 消息发布:", packet.topic, client.id);

  const payloadRaw = packet.payload.toString("utf-8")


  const envelope: IngestEnvelope = {
    topic: packet.topic,
    clientId: client.id,
    payloadRaw,
    receivedAt: Date.now()
  }

  aedes.publish({
    topic: INGEST_TOPIC,
    payload: Buffer.from(JSON.stringify(envelope)),
    qos: 0,
    retain: false,
    cmd: "publish",
    dup: false
  }, (err) => {
    if (err) {
      console.error("❌ 发送 Ingest Envelope 失败:", err);
    } else {
      console.log("✅ 发送 Ingest Envelope 成功:", packet.topic, client.id);
    }
  })



});

aedes.on("subscribe", (subscriptions, client) => {
  console.log("📡 订阅:", client.id, subscriptions.map((s) => s.topic).join(", "));
});

server.listen(port, () => {
  console.log(`🚀 MQTT Broker 已启动，端口: ${port}`);
});

function shutdown() {
  console.log("⏹️ 正在关闭 MQTT Broker...");
  aedes.close(() => {
    server.close(() => {
      console.log("✅ MQTT Broker 已关闭");
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
