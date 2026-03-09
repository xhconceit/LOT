import { Hono } from "hono";
import { v1 } from "./routes/v1";
import { corsMiddleware } from "./middleware/cors";
import { loggerMiddleware } from "./middleware/logger";
import type { ApiServiceConfig } from "./config";
import { createHonoErrorMiddleware } from "@lot/i18n-kit/hono";

export function createApp(config: ApiServiceConfig): Hono {
    const app = new Hono();

    app.use("*", createHonoErrorMiddleware());
    app.use("*", loggerMiddleware)
    app.use("*", corsMiddleware(config.corsOrigin))

    app.route("/api/v1", v1);

    return app
}