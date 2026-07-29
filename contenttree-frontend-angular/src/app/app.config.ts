import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth-interceptor';
import { errorInterceptor } from './core/error-handler/error-interceptor';
import { loadingInterceptor } from './core/loading-indicator/loading-interceptor';
import { ThemeToggleService } from './header/theme-toggle/theme-toggle.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withXhr(),
      withInterceptors([errorInterceptor, authInterceptor, loadingInterceptor]),
    ),
    provideAppInitializer(() => {
      inject(ThemeToggleService).initializeTheme();
    }),
  ],
};
