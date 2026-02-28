import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { health } from "./routes/health";

const port = Number(process.env.PORT) || 3000;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const app = new Hono();

app.use("*", cors({ origin: corsOrigin }));

const api = new Hono();
api.route("/health", health);

app.route("/api/v1", api);

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 API Service 已启动: http://localhost:${port}`);
});

function shutdown() {
  console.log("⏹️ 正在关闭 API Service...");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
