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
});
