import type { MiddlewareHandler } from "hono"
import { cors } from "hono/cors"

export function corsMiddleware(origin: string): MiddlewareHandler {
    return cors({ origin });
}

