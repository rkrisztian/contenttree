import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';
import { environment } from '../environments/environment';

export interface RemoteConfig {
  apiBaseUrl: string;
}

export const REMOTE_CONFIG_PATH = 'config.json';

@Service()
export class AppConfigService {
  readonly remoteConfig = httpResource<RemoteConfig>(() =>
    environment.useRemoteConfig ? REMOTE_CONFIG_PATH : undefined,
  ).asReadonly();

  readonly apiBaseUrl = computed<string>(() =>
    environment.useRemoteConfig ? this.remoteConfig.value()!.apiBaseUrl : environment.apiBaseUrl!,
  );
}
