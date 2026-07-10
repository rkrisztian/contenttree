import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should set and clear loading state on single request', () => {
    service.loadingOn();

    expect(service.isLoading()).toBeTruthy();

    service.loadingOff();

    expect(service.isLoading()).toBeFalsy();
  });

  it('should set and clear loading state on multiple requests', () => {
    service.loadingOn();
    service.loadingOn();

    expect(service.isLoading()).toBeTruthy();

    service.loadingOff();

    expect(service.isLoading()).toBeTruthy();

    service.loadingOff();

    expect(service.isLoading()).toBeFalsy();
  });
});
