import { it } from '@/test-utils/msw-test';
import { LOGIN_DATA } from '@/test-utils/test-data';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService, LOGIN_DATA_KEY } from './auth.service';

describe('AuthService', () => {
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
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
      initTestingModule();

      expect.soft(authService.loginData()).toEqual(LOGIN_DATA);
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
      await TestBed.inject(ApplicationRef).whenStable();

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

      authService.logout();
      await TestBed.inject(ApplicationRef).whenStable();

      expect.soft(authService.loginData()).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });
  });
});
