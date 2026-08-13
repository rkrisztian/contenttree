import appMessages from '@/../public/i18n/en/app.json';
import { ErrorService } from '@/app/core//error-handler/error.service';
import { LoadingService } from '@/app/core//loading-indicator/loading.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { provideTranslateServiceForTest } from '@/test-utils/test-i18n';
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
    it('shows when loading', async () => {
      await renderHeader();

      const loadingService = TestBed.inject(LoadingService);
      loadingService.loadingOn();

      await expect.element(page.getByLabelText('Loading')).toBeVisible();

      loadingService.loadingOff();

      await expect.element(page.getByLabelText('Loading')).not.toBeInTheDocument();
    });
  });

  describe('Error notifications menu', () => {
    afterEach(() => {
      TestBed.inject(ErrorService).hideLatestError();
    });

    it('shows error badge count when there are no errors', async () => {
      await renderHeader();

      await expect
        .element(page.getByLabelText('Error notifications', { exact: true }))
        .toBeVisible();
    });

    it('shows error badge count when there are errors', async () => {
      await renderHeader();

      const errorService = TestBed.inject(ErrorService);
      errorService.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });

      await expect
        .element(page.getByLabelText('Error notifications, 1 error', { exact: true }))
        .toBeVisible();

      errorService.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

      await expect
        .element(page.getByLabelText('Error notifications, 2 errors', { exact: true }))
        .toBeVisible();
    });
  });
});
