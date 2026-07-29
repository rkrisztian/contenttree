import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { AppConfigService } from './app-config.service';
import { ErrorCard } from './core/error-handler/error-card/error-card';
import { ErrorService } from './core/error-handler/error.service';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [Header, MatProgressSpinner, RouterOutlet, ErrorCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly appConfigService = inject(AppConfigService);
  private readonly errorService = inject(ErrorService);

  protected readonly remoteConfig = this.appConfigService.remoteConfig;
  protected readonly latestError = this.errorService.latestError;
}
