import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ErrorService } from './error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    tap({
      error: (response: HttpErrorResponse) => {
        if (response.status === 0) {
          errorService.showError({ error: 'Unexpected error', message: response.message });
        } else if (response.error.error && response.error.message) {
          errorService.showError({
            error: response.error.error,
            message: response.error.message,
            traceId: response.error.traceId || response.error.trace,
          });
        } else {
          console.log('Unknown error: ', response);
        }
      },
    }),
  );
};
