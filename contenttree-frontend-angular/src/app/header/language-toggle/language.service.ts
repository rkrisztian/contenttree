import { computed, effect, inject, Service } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Service()
export class LanguageService {
  static readonly STORAGE_KEY = 'appLanguage';

  private readonly translate = inject(TranslateService);

  readonly currentLanguage = computed(() => this.translate.currentLang()!);

  readonly availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hu', name: 'Magyar' },
  ];

  constructor() {
    effect(() => {
      const lang = this.translate.currentLang() ?? this.translate.fallbackLang() ?? 'en';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
      }
    });
  }

  readonly initLanguage = () => {
    this.translate.use(
      this.getStoredLanguage() ||
        this.translate.getBrowserLang() ||
        this.translate.getCurrentLang()!,
    );
  };

  readonly switchLanguage = (code: string): void => {
    this.translate.use(code);
    this.storeLanguage(code);
  };

  private readonly storeLanguage = (code: string) => {
    localStorage.setItem(LanguageService.STORAGE_KEY, code);
  };

  readonly getStoredLanguage = (): string | null => {
    let storedCode = localStorage.getItem(LanguageService.STORAGE_KEY);

    if (storedCode && !this.availableLanguages.some((langData) => langData.code === storedCode)) {
      storedCode = null;
    }

    return storedCode;
  };
}
