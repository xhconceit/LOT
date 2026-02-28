import type { IngestTelemetry } from "@lot/application";
import { parsePayload } from "@lot/shared";

export function createMqttHandler(ingestTelemetry: IngestTelemetry) {
  return async (topic: string, payload: Buffer) => {
    const raw = payload.toString("utf-8");
    const result = parsePayload(raw);

    if (!result.ok) {
      console.error("❌ Payload 校验失败:", result.error.key, result.error.params ?? "", {
        topic,
        raw,
      });
      return;
    }

    const { deviceId, ts, type, data } = result.data;

    console.log("📥 收到消息:", { topic, deviceId });

    await ingestTelemetry.execute({
      deviceId,
      topic,
      ts,
      type,
      payloadRaw: data ?? {},
    });

    console.log("✅ 入库成功:", deviceId);
  };
}
