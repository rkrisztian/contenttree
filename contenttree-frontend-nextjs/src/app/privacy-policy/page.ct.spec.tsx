import { beforeEach, describe, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import privacyPolicyMessages from "@/i18n/messages/en/privacy-policy.json";
import { it } from "@/test-utils/msw-ct";
import { REMOTE_CONFIG_RESP } from "@/test-utils/msw-mocks";
import { WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WaitForRemoteConfig, WithBackendApiContextProvider } from "@/test-utils/test-providers";
import PrivacyPolicyPage from "./page";

describe("PrivacyPolicyPage", () => {
  const elementsWithCompanyName = page.getByText(REMOTE_CONFIG_RESP.company.name);

  beforeEach(async () => {
    await render(
      <WithTestI18nProvider namespace="privacy-policy" messages={privacyPolicyMessages}>
        <WithBackendApiContextProvider>
          <WaitForRemoteConfig>
            <PrivacyPolicyPage />
          </WaitForRemoteConfig>
        </WithBackendApiContextProvider>
      </WithTestI18nProvider>,
    );
  });

  it("should render", async () => {
    await expect.element(elementsWithCompanyName).toHaveLength(3);
    for (const textElement of elementsWithCompanyName.all()) {
      await expect.element(textElement).toBeVisible();
    }
  });
});
