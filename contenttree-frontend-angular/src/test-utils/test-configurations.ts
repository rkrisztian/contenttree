import { signal } from '@angular/core';
import { render } from 'vitest-browser-angular';
import { TreeApiService } from '../app/api/tree-api.service';
import { AuthService, LoginData } from '../app/core/auth/auth.service';
import { TreePage } from '../app/tree-page/tree-page';
import { TreePageService } from '../app/tree-page/tree-page.service';
import { LOGIN_DATA } from './msw-mocks';

export const renderTreePage = async () =>
  await render(TreePage, {
    providers: [
      TreePageService,
      TreeApiService,
      {
        provide: AuthService,
        useValue: {
          loginData: signal<LoginData>({
            ...LOGIN_DATA,
            expiration: new Date(LOGIN_DATA.expiration),
          }).asReadonly(),
          isAuthenticated: signal(true).asReadonly(),
          isManager: signal(true).asReadonly(),
        } satisfies Partial<AuthService>,
      },
    ],
  });
