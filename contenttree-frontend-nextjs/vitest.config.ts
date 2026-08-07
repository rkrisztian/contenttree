import path from "node:path";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.spec.ts?(x)"],
    exclude: ["src/**/*.ct.spec.ts?(x)"],
    setupFiles: ["src/test-utils/vitest.setup.ts"],
    isolate: false,
    environment: "jsdom",
    globals: true,
    env: loadEnv("development", process.cwd(), ""),
    testTimeout: 5000,
    coverage: {
      enabled: true,
      reporter: ["lcov"],
      include: ["src/**/*.ts?(x)"],
      exclude: ["src/app/_lib/api/types/**", "src/test-utils/**"],
      reportsDirectory: "coverage",
    },
    alias: {
      "next/navigation": path.resolve(__dirname, "src/test-utils/mock-next-navigation.ts"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
