import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "./src/setup-tests.js",
        exclude: ["node_modules", "dist"],
        fileParallelism: false,
    },
})