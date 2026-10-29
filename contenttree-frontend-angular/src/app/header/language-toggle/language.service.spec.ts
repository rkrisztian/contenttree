import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Mock, vi } from 'vitest';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let storageGetItemSpy: Mock<(key: string) => string | null>;
  let storageSetItemSpy: Mock<(key: string, value: string) => void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService, provideTranslateService()],
    });
    service = TestBed.inject(LanguageService);

    storageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    storageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('currentLanguage', () => {
    it('should get current language from TranslateService', () => {
      TestBed.inject(TranslateService).use('hu');

      expect(service.currentLanguage()).toBe('hu');
    });
  });

  describe('getStoredLanguage', () => {
    it('should return stored language if valid', () => {
      storageGetItemSpy.mockReturnValue('hu');

      expect(service.getStoredLanguage()).toBe('hu');
    });

    it('should return null if stored language is invalid', () => {
      storageGetItemSpy.mockReturnValue('de');

      expect(service.getStoredLanguage()).toBeNull();
    });
  });

  describe('initLanguage', () => {
    it("should use stored language if present'", () => {
      storageGetItemSpy.mockReturnValue('hu');

      service.initLanguage();

      expect(service.currentLanguage()).toBe('hu');
    });

    it("should use current language if language is not stored'", () => {
      service.initLanguage();

      expect(service.currentLanguage()).toBe('en');
    });
  });

  describe('switchLanguage', () => {
    it('should switch to new language and save to local storage', () => {
      storageGetItemSpy.mockReturnValue(null);

      service.switchLanguage('hu');

      expect(service.currentLanguage()).toBe('hu');
      expect(storageSetItemSpy).toHaveBeenCalledWith(LanguageService.STORAGE_KEY, 'hu');
    });
  });
});
