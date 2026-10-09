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
    environmentOptions: {
      // Fixes CORS issues (JSDOM has `http://localhost/` as the default document URL).
      jsdom: { url: 'http://localhost:8081/' },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
