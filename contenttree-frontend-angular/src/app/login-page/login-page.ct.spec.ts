import loginMessages from '@/../public/i18n/en/login.json';
import { AuthService } from '@/app/core/auth/auth.service';
import { LoadingService } from '@/app/core/loading-indicator/loading.service';
import { it } from '@/test-utils/msw-ct';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { render } from 'vitest-browser-angular';
import { page, userEvent } from 'vitest/browser';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  const usernameField = () => page.getByPlaceholder(t('login-page.username-field-placeholder'));
  const passwordField = () => page.getByPlaceholder(t('login-page.password-field-placeholder'));
  const loginButton = () =>
    page.getByRole('button', { name: t('login-page.log-in-button-label'), exact: true });

  const mockLoginFn = vi.fn().mockImplementation(() => of(undefined));

  beforeEach(async () => {
    await render(LoginPage, {
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: mockLoginFn,
          },
        },
        LoadingService,
        { provide: Router, useValue: { navigate: vi.fn() } },
        provideTranslateServiceForTest(loginMessages),
      ],
    });
  });

  it('should submit form and navigate on successful login', async () => {
    await userEvent.fill(usernameField(), 'admin');
    await userEvent.fill(passwordField(), 'secret');

    await expect.element(loginButton()).toBeEnabled();

    await loginButton().click();

    expect(mockLoginFn).toHaveBeenCalledWith('admin', 'secret');
  });

  it('should not submit form when fields are empty', async () => {
    await userEvent.fill(usernameField(), 'admin');
    await userEvent.fill(passwordField(), 'secret');

    await expect.element(loginButton()).toBeEnabled();

    await userEvent.clear(usernameField());
    await userEvent.clear(passwordField());

    await expect.element(loginButton()).toBeDisabled();
  });
});
