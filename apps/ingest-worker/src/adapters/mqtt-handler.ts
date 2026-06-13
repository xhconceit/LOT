import type { IngestTelemetry } from "@lot/application";
import { TopicSubscription } from "@lot/domain";
import { mqttTopicMatch, parseIngestEnvelope, parsePayload } from "@lot/shared";

const DEVICE_ID_RE = /^[a-zA-Z0-9_-]+$/;
export function createMqttHandler(
  ingestTelemetry: IngestTelemetry,
  getSubscriptions: () => TopicSubscription[],
) {
  return async (_topic: string, payload: Buffer) => {
    const raw = payload.toString("utf-8");

    const envelopeResult = parseIngestEnvelope(raw);

    if (!envelopeResult.ok) {
      console.error("❌ Ingest Envelope 校验失败:", envelopeResult.error.key, envelopeResult.error.params ?? "", {
        raw,
      })
      return
    }

    const envelope = envelopeResult.data


    // topic 过滤: 只入库匹配到 topic 的订阅
    const subs = getSubscriptions()

    const matched = subs.some(s => mqttTopicMatch(s.pattern, envelope.topic))

    if (!matched) {
      console.log("🔍 消息未匹配到任何订阅，跳过入库:", envelope.topic, {
        topic: envelope.topic,
        clientId: envelope.clientId,
        raw: envelope.payloadRaw,
      })
      return
    }

    const payloadResult = parsePayload(envelope.payloadRaw)

    if (!payloadResult.ok) {
      console.error("❌ Payload 校验失败:", payloadResult.error.key, payloadResult.error.params ?? "", {
        topic: envelope.topic,
        clientId: envelope.clientId,
        raw: envelope.payloadRaw,
      })
      return
    }

    const { deviceId: payloadDeviceId, ts, type, data } = payloadResult.data

    const deviceId = payloadDeviceId ?? envelope.clientId

    if (!deviceId || !DEVICE_ID_RE.test(deviceId)) {
      console.error("❌ 非法设备 ID:", deviceId, {
        topic: envelope.topic,
        clientId: envelope.clientId,
        raw: envelope.payloadRaw,
      })
      return
    }

    if (payloadDeviceId && envelope.clientId && payloadDeviceId !== envelope.clientId) {
      console.warn("⚠️ payload.deviceId 与 clientId 不一致，已优先使用 payload.deviceId:", {
        topic: envelope.topic,
        clientId: envelope.clientId,
        payloadDeviceId,
      });
    }

    console.log("📥 收到 Ingest 消息:", {
      topic: envelope.topic,
      clientId: envelope.clientId,
      deviceId,
    });

    await ingestTelemetry.execute({
      deviceId,
      topic: envelope.topic,
      ts,
      type,
      payloadRaw: data ?? {},
    });

    console.log("✅ 入库成功:", deviceId);
  };
}
