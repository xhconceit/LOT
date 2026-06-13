import { NOOP } from "@lot/shared";
import mqtt from "mqtt";
const INGEST_TOPIC = "__internal__/ingest";

export function createMqttClient(opts: {
    url: string,
    onMessage: (topic: string, payload: Buffer) => void
}) {
    const { url, onMessage } = opts;
    const client = mqtt.connect(url)

    client.on("connect", () => {
        console.log(`🚀 Ingest Worker 已连接 MQTT: ${url}`);
        try {
            client.subscribe(INGEST_TOPIC, (err) => {
                if (err) {
                    console.error("❌ 订阅失败:", err);
                } else {
                    console.log("✅ 订阅成功:", INGEST_TOPIC);
                }
            })
        }
        catch (err) {
            console.error("❌ 订阅内部 Ingest Envelope Topic 失败:", err);
        }
    })

    client.on("message", (topic, payload) => {
        onMessage(topic, payload);
    })

    client.on("error", (err) => {
        console.error("❌ MQTT 连接错误:", err);
    })

    return {
        client,
        shutdown: (cb: () => void = NOOP) => {
            console.log("⏹️ 正在关闭 MQTT 连接...");
            client.end(false, cb)
        }
    }

}