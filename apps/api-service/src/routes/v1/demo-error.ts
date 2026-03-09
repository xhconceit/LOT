import { Hono } from "hono";
import { i18nError } from "@lot/i18n-kit";

const demoError = new Hono();

demoError.get("/", () => {
  throw i18nError("error.unknown");
});

export { demoError };

