export interface TableProvisioner {
  ensureTable(deviceId: string): Promise<void>;
}
