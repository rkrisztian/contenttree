import { TREE_API_BASE_PATH } from '@/app/api/tree-api.service';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated() || !isProtectedPath(req)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${authService.loginData()!.token}` },
    }),
  ).pipe(
    tap({
      error: (response: HttpErrorResponse) => {
        if (response.status === 401) {
          authService.logout();
        }
      },
    }),
  );
};

const isProtectedPath = (req: HttpRequest<unknown>) => {
  const pathname =
    req.url.startsWith('http://') || req.url.startsWith('https://')
      ? new URL(req.url).pathname
      : req.url;

  return pathname.startsWith(TREE_API_BASE_PATH);
};
