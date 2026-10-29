import { loadEnv } from 'vite';
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
        '**/*.spec.ts',
        '**/*.int-spec.ts',
        'src/test-utils/**',
        'src/migrations/*test*',
        'src/main.ts',
        'src/**/*.module.ts',
      ],
      reportsDirectory: 'coverage',
    },
    env: loadEnv('development', process.cwd(), ''),
  },
});
