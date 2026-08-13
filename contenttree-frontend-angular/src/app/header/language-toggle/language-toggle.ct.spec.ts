import appMessages from '@/../public/i18n/en/app.json';
import { provideTranslateServiceForTest, t } from '@/test-utils/test-i18n';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { LanguageToggle } from './language-toggle';

describe('Language Toggle', () => {
  const languageButton = () =>
    page.getByRole('button', {
      name: t('app.language-toggle.language-button-aria-label'),
      exact: true,
    });
  const menuItemHungarian = page.getByRole('menuitem', { name: 'Magyar', exact: true });

  it('should switch language', async () => {
    await render(LanguageToggle, {
      providers: [provideTranslateServiceForTest(appMessages)],
    });

    await languageButton().click();
    await menuItemHungarian.click();
    await languageButton().click();

    expect(menuItemHungarian.element().getAttribute('aria-selected')).toBe('true');
  });
});
