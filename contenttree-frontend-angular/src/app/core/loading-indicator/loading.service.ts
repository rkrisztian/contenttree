import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingCounter = signal<number>(0);
  readonly isLoading = computed(() => this.loadingCounter() > 0);

  loadingOn() {
    this.loadingCounter.update((counter) => counter + 1);
  }

  loadingOff() {
    this.loadingCounter.update((counter) => counter - 1);
  }
}
