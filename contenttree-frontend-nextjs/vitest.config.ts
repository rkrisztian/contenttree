import path from "node:path";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const env = loadEnv("development", process.cwd(), "");

export default defineConfig({
  plugins: [react()],
  test: {
    // server: {
    //   deps: {
    //     inline: ["next", "swr"], // ← inline BOTH, not just next
    //   },
    // },
    include: ["src/**/*.spec.ts?(x)"],
    exclude: ["src/**/*.ct.spec.ts?(x)"],
    setupFiles: ["src/test-utils/vitest.setup.ts"],
    isolate: false,
    environment: "jsdom",
    environmentOptions: {
      // Fixes CORS issues (JSDOM has `http://localhost/` as the default document URL).
      jsdom: { url: env.API_BASE_URL },
    },
    globals: true,
    env,
    testTimeout: 5000,
    coverage: {
      enabled: true,
      reporter: ["lcov"],
      include: ["src/**/*.ts?(x)"],
      exclude: ["src/app/_lib/api/types/**", "src/test-utils/**"],
      reportsDirectory: "coverage",
    },
    alias: {
      "next/navigation": path.resolve(
        import.meta.dirname,
        "src/test-utils/mock-next-navigation.ts",
      ),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
