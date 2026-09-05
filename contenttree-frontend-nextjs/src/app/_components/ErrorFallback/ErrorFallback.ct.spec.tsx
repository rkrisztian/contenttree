import { describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import { ErrorFallback } from "./ErrorFallback";

describe("ErrorFallback", () => {
  const errorText = () => page.getByText(t("app.error-fallback.error-loading"), { exact: true });
  const reloadButton = () =>
    page.getByRole("button", { name: t("app.error-fallback.reload-button-label"), exact: true });

  it("should render error message and reload button", async () => {
    await render(
      <WithTestI18nProvider namespace="app" messages={appMessages}>
        <WithBackendApiContextProvider>
          <ErrorFallback reload={() => {}} />
        </WithBackendApiContextProvider>
      </WithTestI18nProvider>,
    );

    expect(errorText()).toBeVisible();
    expect(reloadButton()).toBeVisible();
  });

  it("should emit reload event when button is clicked", async () => {
    const reloadHandler = vi.fn();

    await render(
      <WithTestI18nProvider namespace="app" messages={appMessages}>
        <WithBackendApiContextProvider>
          <ErrorFallback reload={reloadHandler} />
        </WithBackendApiContextProvider>
      </WithTestI18nProvider>,
    );

    await reloadButton().click();

    expect(reloadHandler).toHaveBeenCalled();
  });
});
