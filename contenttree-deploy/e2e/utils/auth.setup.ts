import { test as setup } from '@playwright/test';
import path from 'node:path';
import { LoginPage } from '../pages/login-page.js';
import { ADMIN_PASSWORD } from './constants.js';
import { getLoginVariantName } from './naming.js';

setup('authenticate', async ({ page }, testInfo) => {
  const authFile = path.resolve(
    import.meta.dirname,
    `../playwright/.auth/${getLoginVariantName(testInfo)}.json`,
  );

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('admin', ADMIN_PASSWORD);

  await page.context().storageState({ path: authFile });
});
