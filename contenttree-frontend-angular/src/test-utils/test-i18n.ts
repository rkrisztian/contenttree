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

export const t: TranslateService['instant'] = (...args) =>
  TestBed.inject(TranslateService).instant(...args);

export const pluralTranslate: TranslateService['instant'] = (...args) =>
  TestBed.inject(PluralTranslatePipe).transform(...args);
