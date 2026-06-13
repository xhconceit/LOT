// 设备实体
export interface Device {
  // 设备唯一标识
  deviceId: string;
  // 首次观察到设备的时间
  firstSeenAt: Date;
  // 设备名称
  name?: string;
  // 最后一次观察到设备的时间
  lastSeenAt: Date;
}
