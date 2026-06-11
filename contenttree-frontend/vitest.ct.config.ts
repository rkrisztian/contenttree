import { mergeConfig } from 'vitest/config';
import unitTestConfig from './vitest.config';

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
});
