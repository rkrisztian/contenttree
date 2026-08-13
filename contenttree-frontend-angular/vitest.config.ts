import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * Vitest config for unit testing, consumed by Angular's `@angular/build:unit-test` builder
 * (with `runnerConfig: true`).
 */
export default defineConfig({
  test: {
    testTimeout: 5000,
    coverage: {
      reportsDirectory: 'coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
