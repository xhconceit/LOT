import type { MiddlewareHandler } from "hono"

export const errorHandlerMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        await next();
    } catch (err) {
        console.error("🚨 Error in middleware: ", err);
        return c.json({
            ok: false,
            error: {
                message: "Internal server error",
            },
        }, 500);
    }
}
