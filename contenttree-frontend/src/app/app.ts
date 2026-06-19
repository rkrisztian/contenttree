import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorCard } from './core/error-handler/error-card/error-card';
import { ErrorService } from './core/error-handler/error.service';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, ErrorCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly errorService = inject(ErrorService);

  protected readonly latestError = this.errorService.latestError;
}
