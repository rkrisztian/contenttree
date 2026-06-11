import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { ErrorService } from '../error.service';
import { ErrorOverlay } from './error-overlay';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(async () => {
    await render(ErrorOverlay, {
      providers: [ErrorService],
    });

    service = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should copy error data to clipboard', async () => {
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementation(async () => {
        return;
      });

    service.showError({
      error: 'dummy error',
      message: 'dummy message',
      traceId: 'abcd-1234',
    });

    await page.getByRole('button', { name: 'Copy error data', exact: true }).click();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(expect.stringContaining('abcd-1234'));
  });
});
