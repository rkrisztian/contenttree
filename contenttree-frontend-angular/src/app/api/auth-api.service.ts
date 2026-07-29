import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import type { LoginReqDto, LoginRespDto } from './types';

export const AUTH_API_BASE_PATH = '/api/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  private readonly authApiBaseUrl = computed(
    () => `${this.config.apiBaseUrl()}${AUTH_API_BASE_PATH}`,
  );

  readonly login = (credentials: LoginReqDto) =>
    this.http.post<LoginRespDto>(`${this.authApiBaseUrl()}/login`, credentials);
}
