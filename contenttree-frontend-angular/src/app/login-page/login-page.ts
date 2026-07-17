import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/auth/auth.service';
import { LoadingService } from '../core/loading-indicator/loading.service';

export interface LoginFormData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormRoot,
    FormField,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly loginModel = signal<LoginFormData>({
    username: '',
    password: '',
  });
  protected readonly loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.username, { message: 'Username is required' });
      required(schemaPath.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async () => {
          this.login();
        },
      },
    },
  );

  protected readonly loading = this.loadingService.isLoading;

  protected readonly login = (): void => {
    this.authService
      .login(this.loginForm.username().value(), this.loginForm.password().value())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };
}
