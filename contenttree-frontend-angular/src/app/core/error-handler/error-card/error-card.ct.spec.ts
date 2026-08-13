import appMessages from '@/../public/i18n/en/app.json';
import { ErrorData, ErrorService } from '@/app/core/error-handler/error.service';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { ErrorCard } from './error-card';

describe('ErrorCard', () => {
  const copyButton = () =>
    page.getByRole('button', { name: t('app.error-card.copy-button-aria-label'), exact: true });

  beforeEach(async () => {
    await render(ErrorCard, {
      providers: [ErrorService, provideTranslateServiceForTest(appMessages)],
      inputs: {
        error: {
          id: '1',
          error: 'dummy error',
          message: 'dummy message',
          traceId: 'abcd-1234',
        } satisfies ErrorData,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should copy error data to clipboard', async () => {
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementation(async () => {
        /* empty */
      });

    await copyButton().click();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(expect.stringContaining('abcd-1234'));
  });
});
