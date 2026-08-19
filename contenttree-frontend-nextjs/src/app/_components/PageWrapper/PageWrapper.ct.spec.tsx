import { HttpResponse, http } from "msw";
import { type ReactNode, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import { REMOTE_CONFIG_PATH } from "@/app/api/config/route";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { REMOTE_CONFIG_RESP } from "@/test-utils/msw-mocks";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WithTreePageContextProvider } from "@/test-utils/test-providers";
import PageWrapper from "./PageWrapper";

describe("PageWrapper", () => {
  const TestPageWrapper = ({ children }: Readonly<{ children?: ReactNode }>) => (
    <WithTestI18nProvider namespace="app" messages={appMessages}>
      <WithTreePageContextProvider>
        <PageWrapper>{children}</PageWrapper>
      </WithTreePageContextProvider>
    </WithTestI18nProvider>
  );

  describe("Loading spinner", () => {
    it("shows when loading", async ({ worker }) => {
      let resolveRequest!: () => void;

      worker.use(
        http.get(
          REMOTE_CONFIG_PATH,
          () =>
            new Promise((resolve) => {
              resolveRequest = () => {
                resolve(HttpResponse.json(REMOTE_CONFIG_RESP));
              };
            }),
        ),
      );

      await render(
        <TestPageWrapper>
          <p>Page loaded</p>
        </TestPageWrapper>,
      );

      await expect
        .element(page.getByText(t("app.loading-indicator"), { exact: true }))
        .toBeVisible();
      await expect.element(page.getByText("Page loaded", { exact: true })).not.toBeInTheDocument();

      await vi.waitUntil(() => resolveRequest);
      resolveRequest();

      await expect
        .element(page.getByText(t("app.loading-indicator"), { exact: true }))
        .not.toBeInTheDocument();
      await expect.element(page.getByText("Page loaded", { exact: true })).toBeVisible();
    });
  });

  describe("Latest error alert", () => {
    beforeEach(async () => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows the latest error", async () => {
      const TestPage = () => {
        const { addAndShowError } = useBackendApi();
        // biome-ignore lint/correctness/useExhaustiveDependencies: one-time effect
        useEffect(() => {
          addAndShowError({ error: "test error", message: "test message" });
        }, []);
        return "";
      };

      await render(
        <TestPageWrapper>
          <TestPage />
        </TestPageWrapper>,
      );
      const alert = page.getByRole("alert");

      await expect.element(alert).toBeVisible();
      await expect.element(alert.getByText("test error")).toBeVisible();

      await vi.runAllTimersAsync();

      await expect.element(alert).not.toBeInTheDocument();
    });
  });
});
