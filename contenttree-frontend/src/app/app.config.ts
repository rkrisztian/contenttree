import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { errorInterceptor } from './core/error-handler/error-interceptor';
import { loadingInterceptor } from './core/loading-indicator/loading-interceptor';
import { ThemeToggleService } from './core/theme-toggle/theme-toggle.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      inject(ThemeToggleService).initializeTheme();
    }),
  ],
};
