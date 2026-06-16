import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      dependencies: ['set up db'],
      use: { ...devices['Desktop Chromium'] },
    },
    {
      name: 'set up db',
      testMatch: /global\.setup\.ts/,
      teardown: 'clean up db',
      use: {
        baseURL: 'http://localhost:8081',
      },
    },
    {
      name: 'clean up db',
      testMatch: /global\.teardown\.ts/,
      use: {
        baseURL: 'http://localhost:8081',
      },
    },
  ],
});
