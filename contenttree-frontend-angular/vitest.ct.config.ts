import { mergeConfig, ViteUserConfig } from 'vitest/config';
import unitTestConfig from './vitest.config.js';

/**
 * Vitest config for component testing, consumed by Angular's `@angular/build:unit-test` builder
 * (with `runnerConfig: true`).
 */
export default mergeConfig(unitTestConfig, {
  test: {
    coverage: {
      reportsDirectory: 'coverage-ct',
    },
  },
} as ViteUserConfig);
