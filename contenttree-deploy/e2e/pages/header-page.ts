import { expect, Page } from '@playwright/test';

export class HeaderPage {
  private readonly userMenuButton = () => this.page.getByRole('button', { name: 'User' });
  private readonly logoutMenuItem = () => this.page.getByRole('menuitem', { name: 'Log Out' });

  constructor(private readonly page: Page) {}

  readonly assertLoggedIn = async () => {
    await this.userMenuButton().click();
    await expect(this.logoutMenuItem()).toBeVisible();
  };
}
