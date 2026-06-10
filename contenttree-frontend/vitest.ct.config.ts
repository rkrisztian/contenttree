import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vitest/config';
import unitTestConfig from './vitest.config';

/**
 * Vitest config for component testing, consumed by Angular's `@angular/build:unit-test` builder
 * (with `runnerConfig: true`).
 */
export default mergeConfig(unitTestConfig, {
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: { channel: 'chromium' },
      }),
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['src/test-utils/vitest.ct.setup.ts'],
    coverage: {
      reportsDirectory: 'coverage-ct',
    },
  },
});
