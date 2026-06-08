import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          channel: 'chromium',
        },
      }),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
  },
  resolve: {
    alias: {
      'environments/environment': new URL(
        'src/environments/environment-development.ts',
        import.meta.url,
      ).pathname,
    },
  },
});
