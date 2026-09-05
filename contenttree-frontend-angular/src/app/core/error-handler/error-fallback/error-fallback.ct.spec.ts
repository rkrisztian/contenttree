import appMessages from '@/../public/i18n/en/app.json';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { ErrorFallback } from './error-fallback';

describe('ErrorFallback', () => {
  const errorText = () => page.getByText(t('app.error-fallback.error-loading'), { exact: true });
  const reloadButton = () =>
    page.getByRole('button', { name: t('app.error-fallback.reload-button-label'), exact: true });

  it('should render error message and reload button', async () => {
    await render(ErrorFallback, {
      providers: [provideTranslateServiceForTest(appMessages)],
    });

    expect(errorText()).toBeVisible();
    expect(reloadButton()).toBeVisible();
  });

  it('should emit reload event when button is clicked', async () => {
    const reloadHandler = vi.fn();

    await render(ErrorFallback, {
      providers: [provideTranslateServiceForTest(appMessages)],
      outputs: {
        reload: reloadHandler,
      },
    });

    await reloadButton().click();

    expect(reloadHandler).toHaveBeenCalled();
  });
});
