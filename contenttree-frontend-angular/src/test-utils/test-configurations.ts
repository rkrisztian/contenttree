import { TreeApiService } from '@/app/api/tree-api.service';
import { AuthService, LoginData } from '@/app/core/auth/auth.service';
import { TreePage } from '@/app/tree-page/tree-page';
import { TreePageService } from '@/app/tree-page/tree-page.service';
import { signal } from '@angular/core';
import { render } from 'vitest-browser-angular';
import { LOGIN_DATA } from './test-data';

export const renderTreePage = async () => {
  return render(TreePage, {
    providers: [
      TreePageService,
      TreeApiService,
      {
        provide: AuthService,
        useValue: {
          loginData: signal<LoginData>(LOGIN_DATA).asReadonly(),
          isAuthenticated: signal(true).asReadonly(),
          isManager: signal(true).asReadonly(),
        } satisfies Partial<AuthService>,
      },
    ],
  });
};
