import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';
import unitTestConfig from './vitest.config.js';

// Not using `mergeConfig`, as it would extend certain options instead of overriding.
export default defineConfig({
  ...unitTestConfig,
  plugins: [msw()],
  test: {
    ...unitTestConfig.test,
    coverage: {
      reportsDirectory: 'coverage-ct',
    },
    environmentOptions: undefined,
    browser: {
      traceView: true,
    },
  },
});
