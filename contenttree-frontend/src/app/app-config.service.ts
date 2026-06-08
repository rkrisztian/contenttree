import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface Config {
  apiBaseUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  readonly REMOTE_CONFIG_PATH = 'config.json';

  private readonly remoteConfig = httpResource<Config>(() =>
    environment.useRemoteConfig ? this.REMOTE_CONFIG_PATH : undefined,
  );
  readonly apiBaseUrl = computed<string>(() => {
    const apiBaseUrl = this.remoteConfig.hasValue()
      ? this.remoteConfig.value().apiBaseUrl
      : environment.apiBaseUrl;

    if (!apiBaseUrl) {
      throw new Error('Configuration error: API base URL is not defined');
    }

    return apiBaseUrl;
  });
}
