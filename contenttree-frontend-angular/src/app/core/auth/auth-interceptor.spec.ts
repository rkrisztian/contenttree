import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { http, HttpResponse } from 'msw';
import { lastValueFrom } from 'rxjs';
import { TREE_API_BASE_URL } from '../../../test-utils/msw-mocks';
import { it } from '../../../test-utils/msw-test';
import { LOGIN_DATA } from '../../../test-utils/test-data';
import { TreeApiService } from '../../api/tree-api.service';
import { REMOTE_CONFIG_PATH } from '../../app-config.service';
import { authInterceptor } from '../../core/auth/auth-interceptor';
import { AuthService, LOGIN_DATA_KEY } from '../../core/auth/auth.service';

describe('authInterceptor', () => {
  const initTestingModule = () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
  };

  afterEach(async () => {
    localStorage.removeItem(LOGIN_DATA_KEY);
  });

  it('should add Authorization header for tree API when token exists', async ({ server }) => {
    let authorizationHeader: string | null = null;
    server.use(
      http.get(TREE_API_BASE_URL, ({ request }) => {
        authorizationHeader = request.headers.get('Authorization');
        return HttpResponse.json([{ id: 1, name: 'Root node' }]);
      }),
    );
    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
    initTestingModule();
    const treeApiService = TestBed.inject(TreeApiService);

    await vi.waitUntil(() => treeApiService.rawNodes.hasValue());

    expect(authorizationHeader).toBe(`Bearer ${LOGIN_DATA.token}`);
  });

  it('should not add Authorization header for unprotected API even when logged in', async ({
    server,
  }) => {
    let authorizationHeader: string | null = null;
    server.use(
      http.get(REMOTE_CONFIG_PATH, ({ request }) => {
        authorizationHeader = request.headers.get('Authorization');
        return HttpResponse.json({});
      }),
    );
    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
    initTestingModule();
    const httpClient = TestBed.inject(HttpClient);

    await lastValueFrom(httpClient.get(REMOTE_CONFIG_PATH));

    expect(authorizationHeader).toBeNull();
  });

  it('should auto-logout when login is expired', async ({ server }) => {
    server.use(
      http.get(TREE_API_BASE_URL, () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );
    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
    initTestingModule();
    const authService = TestBed.inject(AuthService);
    const httpClient = TestBed.inject(HttpClient);

    await expect(lastValueFrom(httpClient.get(TREE_API_BASE_URL))).rejects.toThrow();
    await TestBed.inject(ApplicationRef).whenStable();

    expect.soft(authService.isAuthenticated()).toBeFalsy();
    expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
  });
});
