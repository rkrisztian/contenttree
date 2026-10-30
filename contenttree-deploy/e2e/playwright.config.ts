import { defineConfig, devices } from '@playwright/test';

const BASE_URL_FRONTEND_ANGULAR = 'http://localhost:8080';
const BASE_URL_FRONTEND_NEXTJS = 'http://localhost:3000';
const BASE_URL_BACKEND_SPRINGBOOT = 'http://localhost:8081';
const BASE_URL_BACKEND_NESTJS = 'http://localhost:3001';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  use: {
    trace: {
      mode: 'retain-on-failure',
      snapshots: { dom: true, aria: true, screen: true },
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'angular',
      dependencies: ['set up db - springboot', 'log in - angular'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: BASE_URL_FRONTEND_ANGULAR,
        storageState: 'playwright/.auth/angular.json',
      },
    },
    {
      name: 'nextjs',
      dependencies: ['set up db - nestjs', 'log in - nextjs'],
      use: {
        ...devices['Desktop Chromium'],
        baseURL: BASE_URL_FRONTEND_NEXTJS,
        storageState: 'playwright/.auth/nextjs.json',
      },
    },
    {
      name: 'set up db - springboot',
      testDir: 'utils',
      testMatch: /global\.setup\.ts/,
      dependencies: ['clean up db - springboot'],
      use: {
        baseURL: BASE_URL_BACKEND_SPRINGBOOT,
      },
    },
    {
      name: 'set up db - nestjs',
      testDir: 'utils',
      testMatch: /global\.setup\.ts/,
      dependencies: ['clean up db - nestjs'],
      use: {
        baseURL: BASE_URL_BACKEND_NESTJS,
      },
    },
    {
      name: 'clean up db - springboot',
      testDir: 'utils',
      testMatch: /global\.teardown\.ts/,
      use: {
        baseURL: BASE_URL_BACKEND_SPRINGBOOT,
      },
    },
    {
      name: 'clean up db - nestjs',
      testDir: 'utils',
      testMatch: /global\.teardown\.ts/,
      use: {
        baseURL: BASE_URL_BACKEND_NESTJS,
      },
    },
    {
      name: 'log in - angular',
      testDir: 'utils',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: BASE_URL_FRONTEND_ANGULAR,
      },
    },
    {
      name: 'log in - nextjs',
      testDir: 'utils',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: BASE_URL_FRONTEND_NEXTJS,
      },
    },
  ],
});
