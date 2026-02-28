import { err, ok, type Result } from "../result";
import type { I18nError } from "../types/i18n";
import type { TelemetryPayload } from "../types/telemetry";

const DEVICE_ID_RE = /^[a-zA-Z0-9_-]+$/;

export function parsePayload(raw: string): Result<TelemetryPayload, I18nError> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return err({ key: "error.invalidJson" });
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return err({ key: "error.payloadMustBeObject" });
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.deviceId !== "string" || obj.deviceId.length === 0) {
    return err({ key: "error.missingDeviceId" });
  }

  if (!DEVICE_ID_RE.test(obj.deviceId)) {
    return err({ key: "error.invalidDeviceId", params: { deviceId: obj.deviceId } });
  }

  if (obj.ts !== undefined && typeof obj.ts !== "number") {
    return err({ key: "error.tsMustBeNumber" });
  }

  return ok({
    deviceId: obj.deviceId,
    ts: typeof obj.ts === "number" ? obj.ts : undefined,
    data:
      typeof obj.data === "object" && obj.data !== null
        ? (obj.data as Record<string, unknown>)
        : undefined,
    type: typeof obj.type === "string" ? obj.type : undefined,
  });
}

export function add(a: number, b: number): number {
  return a + b;
}