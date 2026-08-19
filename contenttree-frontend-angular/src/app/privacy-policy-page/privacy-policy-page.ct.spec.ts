import privacyPolicyMessages from '@/../public/i18n/en/privacy-policy.json';
import { it } from '@/test-utils/msw-ct';
import { REMOTE_CONFIG_RESP } from '@/test-utils/msw-mocks';
import { provideTranslateServiceForTest } from '@/test-utils/test-i18n';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { PrivacyPolicyPage } from './privacy-policy-page';

describe('PrivacyPolicyPage', () => {
  const elementsWithCompanyName = page.getByText(REMOTE_CONFIG_RESP.company.name);

  beforeEach(async () => {
    await render(PrivacyPolicyPage, {
      providers: [provideTranslateServiceForTest(privacyPolicyMessages)],
    });
  });

  it('should render', async () => {
    await expect.element(elementsWithCompanyName).toHaveLength(3);
    for (const textElement of elementsWithCompanyName.all()) {
      await expect.element(textElement).toBeVisible();
    }
  });
});
