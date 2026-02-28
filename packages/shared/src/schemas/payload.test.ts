import { describe, expect, it } from "vitest";
import { add } from "./payload";

describe("payload", () => {
    it("should add two numbers", () => {
        expect(add(1, 2)).toBe(3);
    });
});

describe("test", () => {
    it("测试", () => {
        expect(3).toBe(3)
    })
})
