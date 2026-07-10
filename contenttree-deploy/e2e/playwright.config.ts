import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'angular',
      dependencies: ['set up db'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: 'http://localhost:8080',
      },
    },
    {
      name: 'nextjs',
      dependencies: ['set up db'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: 'http://localhost:8084',
      },
    },
    {
      name: 'set up db',
      testDir: 'utils',
      testMatch: /global\.setup\.ts/,
      teardown: 'clean up db',
      use: {
        baseURL: 'http://localhost:8081',
      },
    },
    {
      name: 'clean up db',
      testDir: 'utils',
      testMatch: /global\.teardown\.ts/,
      use: {
        baseURL: 'http://localhost:8081',
      },
    },
  ],
});
