import { playwright } from "@vitest/browser-playwright";
import unitTestConfig from "./vitest.config.ts";

// Not using `mergeConfig`, as it would extend the include/exclude patterns instead of overriding.
export default {
  ...unitTestConfig,
  test: {
    ...unitTestConfig.test,
    include: ["src/**/*.ct.spec.ts?(x)"],
    exclude: [],
    setupFiles: ["src/test-utils/vitest.ct.setup.ts"],
    environment: "node",
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      ...unitTestConfig.test?.coverage,
      reportsDirectory: "coverage-ct",
    },
  },
  define: {
    // Can't access `process` in the browser: https://github.com/vitest-dev/vitest/issues/6667
    "process.env": { API_BASE_URL: unitTestConfig.test?.env?.["API_BASE_URL"] },
  },
};
