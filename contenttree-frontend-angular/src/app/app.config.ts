import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth-interceptor';
import { errorInterceptor } from './core/error-handler/error-interceptor';
import { loadingInterceptor } from './core/loading-indicator/loading-interceptor';
import { LanguageService } from './header/language-toggle/language.service';
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
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '/app.json',
        failOnError: true,
      }),
    }),
    provideAppInitializer(() => {
      inject(LanguageService).initLanguage();
    }),
  ],
};
