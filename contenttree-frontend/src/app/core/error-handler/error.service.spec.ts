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

  it('should initialize errorData as empty', () => {
    expect(service.errors()).toEqual([]);
  });

  it('should update errors when addAndShow is called', () => {
    const errorData = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });

    expect(service.errors()).toEqual([errorData]);
    expect(service.latestError()).toEqual(errorData);
  });

  it('should store all errors', () => {
    const errorData1 = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });
    const errorData2 = service.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

    expect(service.errors()).toEqual([errorData2, errorData1]);
    expect(service.latestError()).toEqual(errorData2);
  });

  it('should hide latest error', () => {
    const errorData1 = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });
    const errorData2 = service.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

    service.hideLatestError();

    expect(service.errors()).toEqual([errorData2, errorData1]);
    expect(service.latestError()).toBeNull();
  });

  it('should remove errorData from errors when deleted', () => {
    const errorData1 = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });
    const errorData2 = service.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

    service.remove(errorData1);

    expect(service.errors()).toEqual([errorData2]);
    expect(service.latestError()).toMatchObject(errorData2);
  });

  it('should hide latest error when deleted', () => {
    const errorData1 = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });
    const errorData2 = service.addAndShow({ error: 'Dummy error 2', message: 'Dummy message 2.' });

    service.remove(errorData2);

    expect(service.errors()).toEqual([errorData1]);
    expect(service.latestError()).toBeNull();
  });

  it('should reset errors to empty when last error becomes deleted', () => {
    const errorData1 = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });

    service.remove(errorData1);

    expect(service.errors()).toEqual([]);
    expect(service.latestError()).toBeNull();
  });

  it('should hide the error automatically after timeout', async () => {
    const errorData = service.addAndShow({ error: 'Dummy error', message: 'Dummy message.' });

    vi.advanceTimersByTime(ErrorService.TIMEOUT_IN_MS);

    expect(service.errors()).toEqual([errorData]);
    expect(service.latestError()).toBeNull();
  });

  it('should always show and hide the latest error', async () => {
    const firstHalfTimeout = Math.floor(ErrorService.TIMEOUT_IN_MS / 2);
    const secondHalfTimeout =
      ErrorService.TIMEOUT_IN_MS - Math.floor(ErrorService.TIMEOUT_IN_MS / 2);

    const errorData1 = service.addAndShow({ error: 'Test error 1', message: 'Test error 1' });
    vi.advanceTimersByTime(firstHalfTimeout);
    const errorData2 = service.addAndShow({ error: 'Test error 1', message: 'Test error 2' });

    expect(service.errors()).toEqual([errorData2, errorData1]);
    expect(service.latestError()).toEqual(errorData2);

    vi.advanceTimersByTime(secondHalfTimeout);

    expect(service.errors()).toEqual([errorData2, errorData1]);
    expect(service.latestError()).toEqual(errorData2);

    vi.advanceTimersByTime(firstHalfTimeout);

    expect(service.errors()).toEqual([errorData2, errorData1]);
    expect(service.latestError()).toBeNull();
  });
});
