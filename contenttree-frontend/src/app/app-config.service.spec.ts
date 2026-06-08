import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { AppConfigService, Config } from './app-config.service';

describe('AppConfigService', () => {
  let httpTesting: HttpTestingController;
  let appConfigService: AppConfigService;
  const origUseRemoteConfig = environment.useRemoteConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  afterEach(() => {
    environment.useRemoteConfig = origUseRemoteConfig;
    httpTesting.verify();
  });

  it('should load remote config in production environment ', async () => {
    environment.useRemoteConfig = true;
    TestBed.tick();
    httpTesting
      .expectOne({ method: 'GET', url: appConfigService.REMOTE_CONFIG_PATH })
      .flush({ apiBaseUrl: 'test-config-path' } satisfies Config);
    await vi.waitUntil(() => appConfigService.apiBaseUrl() != null);

    expect(appConfigService.apiBaseUrl()).toBe('test-config-path');
  });

  it('should load local config in development environment ', async () => {
    TestBed.tick();
    await vi.waitUntil(() => appConfigService.apiBaseUrl() != null);

    expect(appConfigService.apiBaseUrl()).toBe(environment.apiBaseUrl);
  });
});
