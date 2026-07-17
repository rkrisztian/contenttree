import { TestInfo } from '@playwright/test';

export const projectScoped = (nodeName: string, testInfo: TestInfo) =>
  `(${testInfo.project.name}) ${nodeName}`;

export const getLoginVariantName = (testInfo: TestInfo) =>
  testInfo.project.name.replace(/^log in - /, '');
