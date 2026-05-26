import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { ThemeToggleService } from './app/core/theme-toggle/theme-toggle.service';

bootstrapApplication(App, appConfig)
  .then((applicationRef) => {
    const themeToggleService = applicationRef.injector.get(ThemeToggleService);
    themeToggleService.initializeTheme();
  })
  .catch((err) => console.error(err));
