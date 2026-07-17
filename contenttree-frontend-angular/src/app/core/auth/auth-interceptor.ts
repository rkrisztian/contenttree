import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NEVER } from 'rxjs';
import { AUTH_API_BASE_PATH } from '../../api/auth-api.service';
import { TREE_API_BASE_PATH } from '../../api/tree-api.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated() || !isProtectedPath(req)) {
    return next(req);
  }
  if (authService.autoLogOutIfLoginExpired()) {
    return NEVER;
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${authService.loginData()!.token}` },
    }),
  );
};

const isProtectedPath = (req: HttpRequest<unknown>) => {
  const pathname =
    req.url.startsWith('http://') || req.url.startsWith('https://')
      ? new URL(req.url).pathname
      : req.url;

  return pathname.startsWith(TREE_API_BASE_PATH) || pathname.startsWith(AUTH_API_BASE_PATH);
};
