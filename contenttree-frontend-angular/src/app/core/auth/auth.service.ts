import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { tap } from 'rxjs';
import { AuthApiService, LoginRespDto } from '../../api/auth-api.service';

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

  readonly login = (username: string, password: string) =>
    this.authApiService.login({ username, password }).pipe(
      tap((loginRespDto) => {
        this.storeLoginData(loginRespDto);
        this.router.navigate(['/tree']);
      }),
    );

  readonly logout = () => {
    this.clearLoginData();
    this.router.navigate(['/login']);
  };

  private readonly storeLoginData = (loginRespDto: LoginRespDto): void => {
    const loginData = convertLoginRespDtoToLoginData(loginRespDto);

    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(loginData));
    this._loginData.set(loginData);
  };

  private readonly clearLoginData = (): void => {
    localStorage.removeItem(LOGIN_DATA_KEY);
    this._loginData.set(null);
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
