import { describe, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { WithMockAppRouterContextProvider } from "@/test-utils/test-ct-providers";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { LanguageToggle } from "./LanguageToggle";

describe("Language Toggle", () => {
  const languageButton = () =>
    page.getByRole("button", {
      name: t("app.header.language-button-aria-label"),
      exact: true,
    });
  const menuItemHungarian = page.getByRole("menuitem", { name: "Magyar", exact: true });

  it("should switch language", async () => {
    await render(
      <WithMockAppRouterContextProvider>
        <WithTestI18nProvider resources={{ en: { app: appMessages }, hu: { app: appMessages } }}>
          <LanguageToggle />{" "}
        </WithTestI18nProvider>
      </WithMockAppRouterContextProvider>,
    );

    await languageButton().click();
    await menuItemHungarian.click();
    await languageButton().click();

    expect(menuItemHungarian.element().getAttribute("aria-selected")).toBe("true");
  });
});
