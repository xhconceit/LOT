import { defineConfig } from "vitest/config";

const isWindows = process.platform === "win32";

export default defineConfig({
    test: {
        testTimeout: 120_000,
        hookTimeout: isWindows ? 180_000 : 120_000,
        unstubEnvs: true,
        unstubGlobals: true,
        name: {
            label: "LOT",
            color: "red",
        },
        include: ["apps/**/*.test.ts", "packages/**/*.test.ts"],
        exclude: [
            "dist/**",
            "node_modules/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/.git/**"
        ],
        pool: 'forks',
        maxWorkers: '50%',
        setupFiles: ["./test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 50,
                statements: 70,
            },
            include: [
                "apps/*/src/**/*.ts",
                "packages/*/src/**/*.ts",
            ],
        }
    }
});