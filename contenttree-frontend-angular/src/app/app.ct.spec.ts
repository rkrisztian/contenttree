import appMessages from '@/../public/i18n/en/app.json';
import { environment } from '@/environments/environment';
import { it } from '@/test-utils/msw-ct';
import { REMOTE_CONFIG_RESP } from '@/test-utils/msw-mocks';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { http, HttpResponse } from 'msw';
import { describe, expect, vi } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { App } from './app';
import { REMOTE_CONFIG_PATH } from './app-config.service';
import { ErrorService } from './core/error-handler/error.service';
import { LoadingService } from './core/loading-indicator/loading.service';

@Component({
  selector: 'app-test-component',
  template: `<p>Page loaded</p>`,
})
export class TestComponent {}

describe('App', () => {
  describe('Loading spinner', () => {
    const origUseRemoteConfig = environment.useRemoteConfig;

    afterEach(() => {
      environment.useRemoteConfig = origUseRemoteConfig;
    });

    it('shows when loading', async ({ worker }) => {
      environment.useRemoteConfig = true;
      let resolveRequest!: () => void;
      worker.use(
        http.get(
          REMOTE_CONFIG_PATH,
          () =>
            new Promise((resolve) => {
              resolveRequest = () => {
                resolve(HttpResponse.json(REMOTE_CONFIG_RESP));
              };
            }),
        ),
      );

      render(App, {
        providers: [
          LoadingService,
          ErrorService,
          provideRouter([{ path: '', component: TestComponent }]),
          provideTranslateServiceForTest(appMessages),
        ],
      });
      TestBed.inject(Router).initialNavigation();

      await expect
        .element(page.getByText(t('app.loading-indicator'), { exact: true }))
        .toBeVisible();
      await expect.element(page.getByText('Page loaded', { exact: true })).not.toBeInTheDocument();

      await vi.waitUntil(() => resolveRequest);
      resolveRequest();

      await expect
        .element(page.getByText(t('app.loading-indicator'), { exact: true }))
        .not.toBeInTheDocument();
      await expect.element(page.getByText('Page loaded', { exact: true })).toBeVisible();
    });
  });

  describe('Latest error alert', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows the latest error', async () => {
      await render(App, {
        providers: [
          LoadingService,
          ErrorService,
          provideRouter([]),
          provideTranslateServiceForTest(appMessages),
        ],
      });

      TestBed.inject(ErrorService).addAndShow({
        error: 'test error',
        message: 'test message',
      });
      const alert = page.getByRole('alert');

      await expect.element(alert).toBeInTheDocument();
      await expect.element(alert.getByText('test error')).toBeVisible();

      await vi.runAllTimersAsync();

      await expect.element(alert).not.toBeInTheDocument();
    });
  });
});
