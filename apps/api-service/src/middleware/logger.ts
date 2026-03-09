
import type { MiddlewareHandler } from "hono"


export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
    const start = Date.now();
    await next();

    const ms = Date.now() - start;
    const method = c.req.method;
    const path = new URL(c.req.url).pathname;
    const status = c.res.status;

    const emoji = status >= 500 ? "🚨" : status >= 400 ? "❌" : status >= 300 ? "↩️" : status >= 200 ? "✅" : "❓";
    console.log(`${emoji} ${method} ${path} ${status} ${ms}ms`);
}
