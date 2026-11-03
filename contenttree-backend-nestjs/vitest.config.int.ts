import { defineConfig } from 'vitest/config';
import unitTestConfig from './vitest.config.js';

// Not using `mergeConfig`, as it would extend certain options instead of overriding.
export default defineConfig({
  ...unitTestConfig,
  test: {
    ...unitTestConfig.test,
    include: ['**/*.int-spec.ts'],
    setupFiles: ['src/test-utils/vitest.int.setup.ts'],
    coverage: {
      ...unitTestConfig.test?.coverage,
      reportsDirectory: 'coverage-int',
    },
  },
});
