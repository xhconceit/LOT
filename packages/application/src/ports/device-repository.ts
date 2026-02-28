import type { Device } from "@lot/domain";

export interface DeviceRepository {
  findAll(options?: { limit?: number; offset?: number }): Promise<Device[]>;
  findById(deviceId: string): Promise<Device | null>;
  upsert(deviceId: string): Promise<Device>;
}
