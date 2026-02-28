export type DeviceId = string & { readonly __brand: unique symbol };

export interface TelemetryPayload {
  deviceId: string;
  ts?: number;
  data?: Record<string, unknown>;
  type?: string;
}

export interface RawMqttMessage {
  topic: string;
  payload: Buffer | string;
  receivedAt: number;
}
