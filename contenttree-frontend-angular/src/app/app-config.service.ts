import { environment } from '@/environments/environment';
import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';

export interface RemoteConfig {
  apiBaseUrl: string;
  company: {
    name: string;
    address: string;
    privacyEmail: string;
    dataRetentionDays: number;
  };
}

export const REMOTE_CONFIG_PATH = 'config.json';

@Service()
export class AppConfigService {
  readonly remoteConfig = httpResource<RemoteConfig>(() =>
    environment.useRemoteConfig ? REMOTE_CONFIG_PATH : undefined,
  ).asReadonly();

  readonly apiBaseUrl = computed<RemoteConfig['apiBaseUrl']>(() =>
    environment.useRemoteConfig ? this.remoteConfig.value()!.apiBaseUrl : environment.apiBaseUrl!,
  );

  readonly company = computed<RemoteConfig['company']>(() =>
    environment.useRemoteConfig ? this.remoteConfig.value()!.company : environment.company!,
  );
}
