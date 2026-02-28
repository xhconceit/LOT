import type { Device } from "@lot/domain";

import type { DeviceRepository } from "../ports/device-repository";

export interface ListDevicesInput {
  limit?: number;
  offset?: number;
}

export class ListDevices {
  constructor(private readonly devices: DeviceRepository) {}

  async execute(input?: ListDevicesInput): Promise<Device[]> {
    return this.devices.findAll({
      limit: input?.limit,
      offset: input?.offset,
    });
  }
}
