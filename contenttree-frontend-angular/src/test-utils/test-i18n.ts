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
