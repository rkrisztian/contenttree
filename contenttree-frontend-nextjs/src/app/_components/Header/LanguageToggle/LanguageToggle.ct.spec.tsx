import { describe, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { WithMockAppRouterContextProvider } from "@/test-utils/test-ct-providers";
import { WithTestI18nProvider } from "@/test-utils/test-i18n";
import { LanguageToggle } from "./LanguageToggle";

describe("Language Toggle", () => {
  it("should switch language", async () => {
    await render(
      <WithMockAppRouterContextProvider>
        <WithTestI18nProvider resources={{ en: { app: appMessages }, hu: { app: appMessages } }}>
          <LanguageToggle />{" "}
        </WithTestI18nProvider>
      </WithMockAppRouterContextProvider>,
    );

    await page.getByRole("button", { name: "Select language", exact: true }).click();
    await page.getByRole("menuitem", { name: "Magyar", exact: true }).click();
    await page.getByRole("button", { name: "Select language", exact: true }).click();

    expect(
      page
        .getByRole("menuitem", { name: "Magyar", exact: true })
        .element()
        .getAttribute("aria-selected"),
    ).toBe("true");
  });
});
