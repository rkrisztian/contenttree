import { Page } from '@playwright/test';
import { HeaderPage } from './header-page.js';

export class LoginPage {
  private readonly usernameField = () => this.page.getByPlaceholder('Enter username');
  private readonly passwordField = () => this.page.getByPlaceholder('Enter password');
  private readonly loginButton = () =>
    this.page.getByRole('button', { name: 'Log in', exact: true });

  constructor(private readonly page: Page) {}

  readonly goto = async () => {
    await this.page.goto('/');
  };

  readonly login = async (username: string, password: string) => {
    await this.usernameField().fill(username);
    await this.passwordField().fill(password);
    await this.loginButton().click();
    await this.page.waitForURL('**/tree');
    await new HeaderPage(this.page).assertLoggedIn();
  };
}
