import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    coverage: {
      enabled: true,
      reporter: ['lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/test-utils/**',
        'src/main.ts',
        'src/**/*.module.ts',
        'src/migrations/002_test-data.ts',
      ],
      reportsDirectory: 'coverage',
    },
  },
});
