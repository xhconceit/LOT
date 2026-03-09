import { ApiServiceConfig } from "./config";
import { createApp } from "./app";
import {startServer} from "./server";


const app = createApp(ApiServiceConfig);
const server = startServer(app, ApiServiceConfig);



function shutdown(signal: string) {
  console.log(`⏹️ 正在关闭 API Service... (收到信号: ${signal})`);
  server.close();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
