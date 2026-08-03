import { effect, inject, Renderer2, RendererFactory2, Service, signal } from '@angular/core';

@Service()
export class ThemeToggleService {
  static readonly STORAGE_KEY = 'appTheme';
  private static readonly DEFAULT_MODE = 'light';

  private readonly rendererFactory = inject(RendererFactory2);

  private readonly renderer: Renderer2;
  private readonly _mode = signal<'light' | 'dark'>(ThemeToggleService.DEFAULT_MODE);
  readonly mode = this._mode.asReadonly();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    effect(() => {
      this.renderer.setStyle(document.documentElement, 'color-scheme', this._mode());
    });
  }

  readonly initializeTheme = () => {
    const prefersDarkMode = globalThis.matchMedia('(prefers-color-scheme: dark)');

    this._mode.set(this.getStoredMode() ?? (prefersDarkMode.matches ? 'dark' : 'light'));

    prefersDarkMode.addEventListener('change', (event) => {
      this._mode.set(event.matches ? 'dark' : 'light');
    });
  };

  readonly changeMode = () => {
    this._mode.update((mode) => (mode === 'dark' ? 'light' : 'dark'));
    this.storeMode(this._mode());
  };

  private readonly storeMode = (mode: string) => {
    localStorage.setItem(ThemeToggleService.STORAGE_KEY, mode);
  };

  private readonly getStoredMode = (): 'light' | 'dark' | null => {
    let storedMode = localStorage.getItem(ThemeToggleService.STORAGE_KEY);

    if (storedMode && !['light', 'dark'].includes(storedMode)) {
      storedMode = ThemeToggleService.DEFAULT_MODE;
    }

    return (storedMode as 'light' | 'dark') || null;
  };
}
