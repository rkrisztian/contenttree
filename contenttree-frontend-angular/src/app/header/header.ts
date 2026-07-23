import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ErrorCard } from '../core/error-handler/error-card/error-card';
import { ErrorService } from '../core/error-handler/error.service';
import { LoadingService } from '../core/loading-indicator/loading.service';
import { ThemeToggle } from './theme-toggle/theme-toggle';

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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errors = this.errorService.errors;
  protected readonly isLoading = this.loadingService.isLoading;
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly currentUsername = computed<string | null>(
    () => this.authService.loginData()?.username ?? null,
  );

  protected readonly errorNotificationsAriaLabel = (errorCount: number) => {
    let label = 'Error notifications';

    if (errorCount) {
      label += `, ${errorCount} error`;

      if (errorCount > 1) {
        label += 's';
      }
    }

    return label;
  };

  protected readonly login = (): void => {
    this.router.navigate(['/login']);
  };

  protected readonly logout = (): void => {
    this.authService.logout();
  };
}
