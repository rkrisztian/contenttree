import { DestroyRef, inject, Injectable, signal } from '@angular/core';

export interface ErrorData {
  id: string;
  error: string;
  message: string;
  traceId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  static readonly TIMEOUT_IN_MS = 5000;

  private readonly destroyRef = inject(DestroyRef);

  private readonly _errors = signal<ErrorData[]>([]);
  readonly errors = this._errors.asReadonly();

  private readonly _latestError = signal<ErrorData | null>(null);
  readonly latestError = this._latestError.asReadonly();

  private timeout: number | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timeout));
  }

  private readonly createError = (newErrorData: Omit<ErrorData, 'id'>) => ({
    ...newErrorData,
    id: crypto.randomUUID(),
  });

  readonly addAndShow = (newErrorData: Omit<ErrorData, 'id'>): void => {
    const errorData = this.createError(newErrorData);

    this._errors.update((errors) => [errorData, ...errors]);
    this._latestError.set(errorData);

    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hideLatestError, ErrorService.TIMEOUT_IN_MS);
  };

  readonly remove = (errorData: ErrorData): void => {
    this._errors.update((errors) => errors.filter((error) => error.id !== errorData.id));

    if (this.latestError()?.id === errorData.id) {
      this.hideLatestError();
    }
  };

  readonly hideLatestError = (): void => {
    this._latestError.set(null);
  };

  readonly copyToClipboard = async (errorData: ErrorData): Promise<void> => {
    const details = [
      `Error: ${errorData.error}`,
      `Message: ${errorData.message}`,
      ...(errorData.traceId ? [`Trace ID: ${errorData.traceId}`] : []),
    ].join('\n');

    await navigator.clipboard.writeText(details);
  };
}
