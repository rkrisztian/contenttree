import { Routes } from '@angular/router';
import { provideChildTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
    providers: [providePageTranslation('login')],
  },
  {
    path: 'tree',
    loadComponent: () => import('./tree-page/tree-page').then((m) => m.TreePage),
    canActivate: [authGuard],
    providers: [providePageTranslation('tree')],
  },
  {
    path: 'about',
    loadComponent: () => import('./about-page/about-page').then((m) => m.AboutPage),
  },
];

function providePageTranslation(path: string) {
  return provideChildTranslateService({
    loader: provideTranslateHttpLoader({
      prefix: '/i18n/',
      suffix: `/${path}.json`,
      failOnError: true,
    }),
  });
}
