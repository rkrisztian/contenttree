import { TestInfo } from '@playwright/test';

export const projectScoped = (name: string, testInfo: TestInfo) =>
  `(${testInfo.project.name}) ${name}`;
