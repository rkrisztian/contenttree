import { PluralTranslatePipe } from '@/app/core/i18n/plural-translate.pipe';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export const provideTranslateServiceForTest = (messages: unknown) => {
  return provideTranslateService({
    fallbackLang: 'en',
    lang: 'en',
    loader: () => ({ getTranslation: () => of(messages) }),
  });
};

export const t: (...args: Parameters<TranslateService['instant']>) => string = (...args) =>
  TestBed.inject(TranslateService).instant(...args) as string;

export const pluralTranslate = (...args: Parameters<PluralTranslatePipe['transform']>) =>
  TestBed.inject(PluralTranslatePipe).transform(...args) as string;
