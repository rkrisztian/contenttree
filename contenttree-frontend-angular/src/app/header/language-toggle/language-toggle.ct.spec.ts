import appMessages from '@/../public/i18n/en/app.json';
import { provideTranslateServiceForTest } from '@/test-utils/test-i18n';
import { TestBed } from '@angular/core/testing';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { LanguageToggle } from './language-toggle';
import { LanguageService } from './language.service';

describe('Language Toggle', () => {
  it('should switch language', async () => {
    await render(LanguageToggle, {
      providers: [provideTranslateServiceForTest(appMessages)],
    });

    await page.getByRole('button', { name: 'Select language', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Magyar', exact: true }).click();

    expect(TestBed.inject(LanguageService).currentLanguage()).toBe('hu');
  });
});
