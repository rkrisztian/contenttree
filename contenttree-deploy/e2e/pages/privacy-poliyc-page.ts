import { expect, Page } from '@playwright/test';
import { COMPANY_NAME } from '../utils/constants.js';

export class PrivacyPolicyPage {
  private readonly elementsWithCompanyName = () => this.page.getByText(COMPANY_NAME);

  constructor(private readonly page: Page) {}

  readonly goto = async () => {
    await this.page.goto('/privacy-policy');
  };

  readonly assertCompanyNameShown = async () => {
    await expect(this.elementsWithCompanyName()).toHaveCount(3);
    for (const textElement of await this.elementsWithCompanyName().all()) {
      await expect(textElement).toBeVisible();
    }
  };
}
