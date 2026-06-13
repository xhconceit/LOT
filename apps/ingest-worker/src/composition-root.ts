import { Sql } from "postgres";
import { PgDeviceRepository } from "./infra/pg-device-repository";
import { PgTelemetryRepository } from "./infra/pg-telemetry-repository";
import { PgTopicConfigRepository } from "./infra/pg-topic-config-repository";
import { IngestTelemetry } from "@lot/application";


export function buildContainer(sql: Sql) {
    // 设备仓库
    const deviceRepo = new PgDeviceRepository(sql)
    // 遥测仓库
    const telemetryRepo = new PgTelemetryRepository(sql)
    // 遥测使用 case
    const topicConfigRepo = new PgTopicConfigRepository(sql)
    // 遥测使用 case
    const ingestTelemetry = new IngestTelemetry(deviceRepo, telemetryRepo)

    return {
        topicConfigRepo,
        ingestTelemetry,
    }
}