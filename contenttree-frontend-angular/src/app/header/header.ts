import { AuthService } from '@/app/core/auth/auth.service';
import { ErrorCard } from '@/app/core/error-handler/error-card/error-card';
import { ErrorService } from '@/app/core/error-handler/error.service';
import { LoadingService } from '@/app/core/loading-indicator/loading.service';
import { Component, computed, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateBlockDirective } from '@ngx-translate/core';
import { PluralTranslatePipe } from '../core/i18n/plural-translate.pipe';
import { LanguageToggle } from './language-toggle/language-toggle';
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
    LanguageToggle,
    ErrorCard,
    TranslateBlockDirective,
    PluralTranslatePipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
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

  protected readonly login = (): void => {
    this.router.navigate(['/login']);
  };

  protected readonly logout = (): void => {
    this.authService.logout();
  };
}
