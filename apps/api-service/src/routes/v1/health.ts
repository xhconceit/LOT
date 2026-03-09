import { Hono } from "hono";

const health = new Hono();

health.get("/", (c) => {
  return c.json({ ok: true, data: { status: "healthy", timestamp: Date.now() } });
});

export { health };
