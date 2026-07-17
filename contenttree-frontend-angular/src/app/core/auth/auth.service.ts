import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthApiService, LoginRespDto } from '../../api/auth-api.service';

export const LOGIN_DATA_KEY = 'loginData';

export interface LoginData {
  token: string;
  username: string;
  role: LoginRespDto['role'];
  expiration: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  readonly _loginData = signal<LoginData | null>(
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

  readonly logout = () =>
    this.authApiService.logout().pipe(
      tap(() => {
        this.clearLoginData();
        this.router.navigate(['/login']);
      }),
    );

  readonly autoLogOutIfLoginExpired = () => {
    if (this._loginData() && this._loginData()!.expiration <= new Date()) {
      this.clearLoginData();
      this.router.navigate(['/login']);
      return true;
    }

    return false;
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

const convertLoginRespDtoToLoginData = (loginRespDto: LoginRespDto): LoginData => ({
  token: loginRespDto.token,
  username: loginRespDto.username,
  role: loginRespDto.role,
  expiration: new Date(loginRespDto.expiration),
});

const convertStringToLoginData = (loginDataStr: string | null): LoginData | null => {
  if (!loginDataStr) {
    return null;
  }

  const loginData = JSON.parse(loginDataStr);

  return { ...loginData, expiration: new Date(loginData.expiration) };
};
