import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface RemoteConfig {
  apiBaseUrl: string;
}

export const REMOTE_CONFIG_PATH = 'config.json';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  readonly remoteConfig = httpResource<RemoteConfig>(() =>
    environment.useRemoteConfig ? REMOTE_CONFIG_PATH : undefined,
  ).asReadonly();

  readonly apiBaseUrl = computed<string>(() =>
    environment.useRemoteConfig ? this.remoteConfig.value()!.apiBaseUrl : environment.apiBaseUrl!,
  );
}
