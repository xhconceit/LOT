
export const config = {
    databaseUrl: process.env.DATABASE_URL ?? "postgres://lot:lot_secret@localhost:5432/lot",
    mqttUrl: process.env.MQTT_URL ?? "mqtt://localhost:1883",
} as const;