import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize errorData as null', () => {
    expect(service.errorData()).toBeNull();
  });

  it('should update errorData when showError is called', () => {
    const errorData = { error: 'Dummy error', message: 'Dummy message.' };

    service.showError(errorData);

    expect(service.errorData()).toEqual(errorData);
  });

  it('should reset errorData to null when hide is called', () => {
    const errorData = { error: 'Dummy error', message: 'Dummy message.' };

    service.showError(errorData);
    service.hide();

    expect(service.errorData()).toBeNull();
  });

  it('should clear the error automatically after timeout', async () => {
    const errorData = { error: 'Dummy error', message: 'Dummy message.' };

    service.showError(errorData);
    vi.advanceTimersByTime(ErrorService.TIMEOUT_IN_MS);

    expect(service.errorData()).toBeNull();
  });

  it('should always show and hide the latest error', async () => {
    const errorData1 = { error: 'Test error 1', message: 'Test error 1' };
    const errorData2 = { error: 'Test error 1', message: 'Test error 2' };
    const firstHalfTimeout = Math.floor(ErrorService.TIMEOUT_IN_MS / 2);
    const secondHalfTimeout =
      ErrorService.TIMEOUT_IN_MS - Math.floor(ErrorService.TIMEOUT_IN_MS / 2);

    service.showError(errorData1);
    vi.advanceTimersByTime(firstHalfTimeout);
    service.showError(errorData2);

    expect(service.errorData()).toEqual(errorData2);

    vi.advanceTimersByTime(secondHalfTimeout);

    expect(service.errorData()).toEqual(errorData2);

    vi.advanceTimersByTime(firstHalfTimeout);

    expect(service.errorData()).toBeNull();
  });
});
