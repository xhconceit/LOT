import { createServer } from "node:net";

import { Aedes } from "aedes";

const port = Number(process.env.MQTT_PORT) || 1883;

const aedes = await Aedes.createBroker();
const server = createServer(aedes.handle);

aedes.on("client", (client) => {
  console.log("🔗 客户端连接:", client.id);
});

aedes.on("clientDisconnect", (client) => {
  console.log("⛔ 客户端断开:", client.id);
});

aedes.on("publish", (_packet, client) => {
  if (client) {
    console.log("📤 消息发布:", client.id);
  }
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
