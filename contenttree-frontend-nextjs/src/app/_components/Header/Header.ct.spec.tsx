import { HttpResponse, http } from "msw";
import type { ReactNode } from "react";
import { describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render, renderHook } from "vitest-browser-react/pure";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { TEST_REMOTE_CONFIG } from "@/test-utils/test-data";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WithTreePageContextProvider } from "@/test-utils/test-providers";
import { Header } from "./Header";

describe("Header", () => {
  const HeaderWithTreePageContextProvider = ({ children }: Readonly<{ children?: ReactNode }>) => (
    <WithTestI18nProvider resources={{ en: { app: appMessages } }}>
      <WithTreePageContextProvider>
        <Header />
        {children}
      </WithTreePageContextProvider>
    </WithTestI18nProvider>
  );

  describe("Loading spinner", () => {
    const loadingMenuButton = () =>
      page.getByLabelText(t("app.header.loading-indicator-aria-label"));

    it("shows when loading", async ({ worker }) => {
      let resolveRequest!: () => void;

      worker.use(
        http.get(
          `${TREE_API_BASE_URL}`,
          () =>
            new Promise((resolve) => {
              resolveRequest = () => {
                resolve(HttpResponse.json([]));
              };
            }),
        ),
      );

      await render(<HeaderWithTreePageContextProvider />);

      await expect.element(loadingMenuButton()).toBeVisible();

      await vi.waitUntil(() => resolveRequest);
      resolveRequest();

      await expect.element(loadingMenuButton()).not.toBeInTheDocument();
    });
  });

  describe("Error notifications menu", () => {
    const errorNotificationsButtonWithZeroErrors = () =>
      page.getByLabelText(t("app.header.errors-menu-button-aria-label_other", { count: 0 }));
    const errorNotificationsButtonWithOneError = () =>
      page.getByLabelText(t("app.header.errors-menu-button-aria-label_one", { count: 1 }));
    const errorNotificationsButtonWithTwoErrors = () =>
      page.getByLabelText(t("app.header.errors-menu-button-aria-label_other", { count: 2 }));

    it("shows error badge count when there are no errors", async () => {
      await render(<HeaderWithTreePageContextProvider />);

      await expect.element(errorNotificationsButtonWithZeroErrors()).toBeVisible();
    });

    it("shows error badge count when there are errors", async ({ worker }) => {
      worker.use(
        http.get(`${TEST_REMOTE_CONFIG.apiBaseUrl}/test-path`, () => {
          return HttpResponse.error();
        }),
      );

      const { result: hooks, act } = await renderHook(() => useBackendApi(), {
        wrapper: HeaderWithTreePageContextProvider,
      });

      await act(async () =>
        expect(hooks.current.backendApiRef.current.get("/test-path")).rejects.toThrow(),
      );

      await expect.element(errorNotificationsButtonWithOneError()).toBeVisible();

      await act(async () =>
        expect(hooks.current.backendApiRef.current.get("/test-path")).rejects.toThrow(),
      );

      await expect.element(errorNotificationsButtonWithTwoErrors()).toBeVisible();
    });
  });
});
