import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ErrorCard } from '../core/error-handler/error-card/error-card';
import { ErrorService } from '../core/error-handler/error.service';
import { LoadingService } from '../core/loading-indicator/loading.service';
import { ThemeToggle } from '../core/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    RouterLink,
    ThemeToggle,
    ErrorCard,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly errorService = inject(ErrorService);
  private readonly loadingService = inject(LoadingService);

  protected readonly errors = this.errorService.errors;
  protected readonly isLoading = this.loadingService.isLoading;
}
