import { defineConfig, devices } from '@playwright/test';

const BASE_URL_ANGULAR = 'http://localhost:8080';
const BASE_URL_NEXTJS = 'http://localhost:8084';
const BASE_URL_BACKEND = 'http://localhost:8081';

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
      dependencies: ['set up db', 'log in - angular'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: BASE_URL_ANGULAR,
        storageState: 'playwright/.auth/angular.json',
      },
    },
    {
      name: 'nextjs',
      dependencies: ['set up db', 'log in - nextjs'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: BASE_URL_NEXTJS,
        storageState: 'playwright/.auth/nextjs.json',
      },
    },
    {
      name: 'set up db',
      testDir: 'utils',
      testMatch: /global\.setup\.ts/,
      dependencies: ['clean up db'],
      use: {
        baseURL: BASE_URL_BACKEND,
      },
    },
    {
      name: 'clean up db',
      testDir: 'utils',
      testMatch: /global\.teardown\.ts/,
      use: {
        baseURL: BASE_URL_BACKEND,
      },
    },
    {
      name: 'log in - angular',
      testDir: 'utils',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: BASE_URL_ANGULAR,
      },
    },
    {
      name: 'log in - nextjs',
      testDir: 'utils',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: BASE_URL_NEXTJS,
      },
    },
  ],
});
