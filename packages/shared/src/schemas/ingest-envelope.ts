import { ok, err, type Result } from '../result'
import type { I18nError } from "../types/i18n"
import { IngestEnvelope } from '../types/ingest-envelope'



export function parseIngestEnvelope(raw: string): Result<IngestEnvelope, I18nError> {

    let parsed: unknown

    try {
        console.log("🔍 解析 Ingest Envelope:", raw);
        parsed = JSON.parse(raw)
    } catch {
        return err({ key: "error.invalidJson" });
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return err({
            key: "error.ingestEnvelopeMustBeObject",
        })
    }

    const obj = parsed as Record<string, unknown>

    if (typeof obj.topic !== "string" || obj.topic.length === 0) {
        return err({
            key: "error.missingTopic",
        })
    }

    if (typeof obj.payloadRaw !== "string") {
        return err({
            key: "error.missingPayloadRaw",
        })
    }

    if (obj.clientId !== undefined && typeof obj.clientId !== "string") {
        return err({
            key: "error.clientIdMustBeString",
        })
    }


    return ok({
        topic: obj.topic,
        clientId: typeof obj.clientId === "string" ? obj.clientId : undefined,
        payloadRaw: obj.payloadRaw,
        receivedAt: Date.now()
    })

}