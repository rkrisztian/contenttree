import { Component, effect, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateBlockDirective, TranslateService } from '@ngx-translate/core';
import { AppConfigService } from './app-config.service';
import { ErrorCard } from './core/error-handler/error-card/error-card';
import { ErrorService } from './core/error-handler/error.service';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [Header, MatProgressSpinner, RouterOutlet, ErrorCard, TranslateBlockDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly appConfigService = inject(AppConfigService);
  private readonly errorService = inject(ErrorService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translateService = inject(TranslateService);

  protected readonly remoteConfig = this.appConfigService.remoteConfig;
  protected readonly latestError = this.errorService.latestError;

  constructor() {
    effect(() => {
      this.title.setTitle(this.translateService.translate('app.title')());
      this.meta.updateTag({
        name: 'description',
        content: this.translateService.translate('app.description')(),
      });
    });
  }
}
