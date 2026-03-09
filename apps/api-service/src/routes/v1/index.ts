import { Hono } from "hono";
import { health } from "./health";
import { demoError } from "./demo-error";

const v1 = new Hono();

v1.route("/health", health);
v1.route("/demo-error", demoError);

export { v1 };