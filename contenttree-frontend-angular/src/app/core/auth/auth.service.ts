import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { tap } from 'rxjs';
import { AuthApiService } from '../../api/auth-api.service';
import type { LoginRespDto } from '../../api/types';

export const LOGIN_DATA_KEY = 'loginData';

export type Role = 'READER' | 'MANAGER' | 'ADMIN';

export interface LoginData {
  token: string;
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  private readonly _loginData = signal<LoginData | null>(
    convertStringToLoginData(localStorage.getItem(LOGIN_DATA_KEY)),
  );
  readonly loginData = this._loginData.asReadonly();
  readonly isAuthenticated = computed(() => !!this._loginData());
  readonly isManager = computed(
    () => this._loginData() && ['ADMIN', 'MANAGER'].includes(this._loginData()!.role),
  );

  constructor() {
    effect(() => {
      if (this._loginData()) {
        localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(this._loginData()));
      } else {
        localStorage.removeItem(LOGIN_DATA_KEY);
      }
    });
  }

  readonly login = (username: string, password: string) =>
    this.authApiService.login({ username, password }).pipe(
      tap((loginRespDto) => {
        this._loginData.set(convertLoginRespDtoToLoginData(loginRespDto));
        this.router.navigate(['/tree']);
      }),
    );

  readonly logout = () => {
    this._loginData.set(null);
    this.router.navigate(['/login']);
  };
}

const convertLoginRespDtoToLoginData = (loginRespDto: LoginRespDto): LoginData => {
  const jwtClaims = decodeJwt(loginRespDto.token);

  return {
    token: loginRespDto.token,
    username: jwtClaims.sub!,
    role: jwtClaims['role'] as Role,
  };
};

const convertStringToLoginData = (loginDataStr: string | null): LoginData | null =>
  loginDataStr ? JSON.parse(loginDataStr) : null;
