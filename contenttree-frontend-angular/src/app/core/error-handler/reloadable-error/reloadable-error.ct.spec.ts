import appMessages from '@/../public/i18n/en/app.json';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { ReloadableError } from './reloadable-error';

describe('ReloadableError', () => {
  const errorText = () => page.getByText(t('app.reloadable-error.error-loading'));
  const reloadButton = () =>
    page.getByRole('button', { name: t('app.reloadable-error.reload-button-label') });

  it('should render error message and reload button', async () => {
    await render(ReloadableError, {
      providers: [provideTranslateServiceForTest(appMessages)],
    });

    expect(errorText()).toBeVisible();
    expect(reloadButton()).toBeVisible();
  });

  it('should emit reload event when button is clicked', async () => {
    const reloadHandler = vi.fn();

    await render(ReloadableError, {
      providers: [provideTranslateServiceForTest(appMessages)],
      outputs: {
        reload: reloadHandler,
      },
    });

    await reloadButton().click();

    expect(reloadHandler).toHaveBeenCalled();
  });
});
