import { test } from '@playwright/test';
import { PrivacyPolicyPage } from '../pages/privacy-poliyc-page.js';

test('should show privacy policy page', async ({ page }, { project }) => {
  // In the Next.js app, the privacy policy page is a server component, hence it is not testable
  // as a component test.
  test.skip(project.name === 'angular', 'already tested in the Angular app project');

  const privacyPolicyPage = new PrivacyPolicyPage(page);

  await privacyPolicyPage.goto();
  await privacyPolicyPage.assertCompanyNameShown();
});
