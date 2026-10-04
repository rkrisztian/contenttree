import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ErrorData, ErrorService } from './error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    tap({
      error: (response: HttpErrorResponse) => {
        if (response.status === 0) {
          errorService.addAndShow({ error: 'Unexpected error', message: response.message });
        } else if (isErrorData(response.error)) {
          errorService.addAndShow({
            error: response.error.error,
            message: response.error.message,
            traceId: response.error.traceId,
          });
        } else {
          console.log('Unknown error: ', response);
        }
      },
    }),
  );
};

const isErrorData = (value: unknown): value is Omit<ErrorData, 'id'> => {
  return value !== null && typeof value === 'object' && 'error' in value && 'message' in value;
};
