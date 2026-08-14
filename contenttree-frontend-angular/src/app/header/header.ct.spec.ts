import appMessages from '@/../public/i18n/en/app.json';
import { ErrorService } from '@/app/core//error-handler/error.service';
import { LoadingService } from '@/app/core//loading-indicator/loading.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { Header } from './header';

describe('Header', () => {
  const renderHeader = async () =>
    render(Header, {
      providers: [
        LoadingService,
        ErrorService,
        AuthService,
        provideRouter([]),
        provideTranslateServiceForTest(appMessages),
      ],
    });

  describe('Loading spinner', () => {
    const loadingMenuButton = () =>
      page.getByLabelText(t('app.header.loading-indicator-aria-label'));

    it('shows when loading', async () => {
      await renderHeader();

      const loadingService = TestBed.inject(LoadingService);
      loadingService.loadingOn();

      await expect.element(loadingMenuButton()).toBeVisible();

      loadingService.loadingOff();

      await expect.element(loadingMenuButton()).not.toBeInTheDocument();
    });
  });

  describe('Error notifications menu', () => {
    const errorNotificationsButtonWithZeroErrors = () =>
      page.getByLabelText(t('app.header.errors-menu-button-aria-label_other', { count: 0 }));
    const errorNotificationsButtonWithOneError = () =>
      page.getByLabelText(t('app.header.errors-menu-button-aria-label_one', { count: 1 }));
    const errorNotificationsButtonWithTwoErrors = () =>
      page.getByLabelText(t('app.header.errors-menu-button-aria-label_other', { count: 2 }));

    afterEach(() => {
      TestBed.inject(ErrorService).hideLatestError();
    });

    it('shows error badge count when there are no errors', async () => {
      await renderHeader();

      await expect.element(errorNotificationsButtonWithZeroErrors()).toBeVisible();
    });

    it('shows error badge count when there are errors', async () => {
      await renderHeader();

      const errorService = TestBed.inject(ErrorService);
      errorService.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });

      await expect.element(errorNotificationsButtonWithOneError()).toBeVisible();

      errorService.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

      await expect.element(errorNotificationsButtonWithTwoErrors()).toBeVisible();
    });
  });
});
