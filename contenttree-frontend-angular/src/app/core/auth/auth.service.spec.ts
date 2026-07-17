import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LOGIN_DATA } from '../../../test-utils/msw-mocks';
import { it } from '../../../test-utils/msw-test';
import { AuthService, LOGIN_DATA_KEY, LoginData } from './auth.service';

describe('AuthService', () => {
  const TEST_LOGIN_DATA = {
    ...LOGIN_DATA,
    expiration: new Date(LOGIN_DATA.expiration),
  } as LoginData;

  let authService: AuthService;

  const initTestingModule = () => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    });

    authService = TestBed.inject(AuthService);
  };

  afterEach(async () => {
    localStorage.removeItem(LOGIN_DATA_KEY);
  });

  describe('login data', () => {
    it('should initialize from localStorage when stored', () => {
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(TEST_LOGIN_DATA));
      initTestingModule();

      expect.soft(authService.loginData()).toEqual(TEST_LOGIN_DATA);
      expect.soft(authService.isAuthenticated()).toBeTruthy();
    });

    it('should be null when no token in localStorage', () => {
      initTestingModule();

      expect.soft(authService.loginData()).toBeNull();
      expect.soft(authService.isAuthenticated()).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should store login data in local storage', async () => {
      initTestingModule();

      await lastValueFrom(authService.login('admin', 'secret'));

      expect.soft(authService.loginData()).toMatchObject({ username: 'admin', role: 'ADMIN' });
      expect.soft(authService.loginData()?.token).toBeDefined();
      expect
        .soft(JSON.parse(localStorage.getItem(LOGIN_DATA_KEY) ?? '{}'))
        .toMatchObject({ username: 'admin', role: 'ADMIN' });
    });
  });

  describe('logout', () => {
    it('should clear login data from local storage', async () => {
      initTestingModule();

      await lastValueFrom(authService.logout());

      expect.soft(authService.loginData()).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });
  });

  describe('autoLogOutIfLoginExpired', () => {
    it('should return false and do nothing when login data is not expired', () => {
      localStorage.setItem(
        LOGIN_DATA_KEY,
        JSON.stringify({
          ...TEST_LOGIN_DATA,
          expiration: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
        }),
      );
      initTestingModule();

      const expired = authService.autoLogOutIfLoginExpired();

      expect.soft(expired).toBeFalsy();
      expect.soft(authService.loginData()).not.toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeTruthy();
    });

    it('should return true, clear data, and navigate to login when expired', () => {
      localStorage.setItem(
        LOGIN_DATA_KEY,
        JSON.stringify({
          ...TEST_LOGIN_DATA,
          expiration: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        }),
      );
      initTestingModule();

      const expired = authService.autoLogOutIfLoginExpired();

      expect.soft(expired).toBeTruthy();
      expect.soft(authService.loginData()).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });

    it('should handle null login data gracefully', () => {
      initTestingModule();

      const expired = authService.autoLogOutIfLoginExpired();

      expect(expired).toBeFalsy();
    });
  });
});
