import type { MiddlewareHandler } from "hono"
import { toApiErrorResponse } from "./api-error"
import { ContentfulStatusCode } from "hono/utils/http-status";


export function createHonoErrorMiddleware(): MiddlewareHandler {
    return async (c, next) => {
        try {
            await next();
        } catch (err) {
            const { status, body } = toApiErrorResponse(err);
            console.error("🚨 未捕获的错误: ", err);
            return c.json(body, status as ContentfulStatusCode);
        }
    }
}