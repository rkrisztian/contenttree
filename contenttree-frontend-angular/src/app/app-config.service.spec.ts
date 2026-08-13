import { environment } from '@/environments/environment';
import { it } from '@/test-utils/msw-test';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let appConfigService: AppConfigService;
  const origUseRemoteConfig = environment.useRemoteConfig;

  beforeEach(() => {
    appConfigService = TestBed.inject(AppConfigService);
  });

  afterEach(() => {
    environment.useRemoteConfig = origUseRemoteConfig;
  });

  it('should load remote config in production environment ', async () => {
    environment.useRemoteConfig = true;
    await vi.waitUntil(() => appConfigService.remoteConfig.hasValue());

    expect(appConfigService.apiBaseUrl()).toBe('test-config-path');
  });

  it('should load local config in development environment ', async () => {
    await vi.waitUntil(() => appConfigService.apiBaseUrl() != null);

    expect(appConfigService.apiBaseUrl()).toBe(environment.apiBaseUrl);
  });
});
