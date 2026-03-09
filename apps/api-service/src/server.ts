import { serve } from "@hono/node-server";
import type { Hono } from "hono"
import type { ApiServiceConfig } from "./config";

export type RunningServer = Readonly<{
    close: () => void
}>

export function startServer(app: Hono, config: ApiServiceConfig): RunningServer {
    const server = serve({
        fetch: app.fetch,
        port: config.port,
    }, () => {
        console.log(`🚀 API Service 已启动: http://localhost:${config.port}`);
    });

    return {
        close: () => {
            console.log("⏹️ 正在关闭 API Service...");
            server.close();
        },
    } as const;
}