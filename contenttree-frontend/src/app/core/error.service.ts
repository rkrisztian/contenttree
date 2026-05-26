import { DestroyRef, inject, Injectable, signal } from '@angular/core';

export interface ErrorData {
  error: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  static readonly TIMEOUT_IN_MS = 5000;

  private readonly destroyRef = inject(DestroyRef);

  private readonly _errorData = signal<ErrorData | null>(null);
  readonly errorData = this._errorData.asReadonly();
  private timeout: number | undefined = undefined;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timeout));
  }

  showError = (errorData: ErrorData): void => {
    this._errorData.set(errorData);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hide, ErrorService.TIMEOUT_IN_MS);
  };

  hide = (): void => {
    this._errorData.set(null);
  };
}
