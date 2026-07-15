import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { ErrorData, ErrorService } from '../error.service';
import { ErrorCard } from './error-card';

describe('ErrorCard', () => {
  beforeEach(async () => {
    await render(ErrorCard, {
      providers: [ErrorService],
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

    await page.getByRole('button', { name: 'Copy error data', exact: true }).click();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(expect.stringContaining('abcd-1234'));
  });
});
