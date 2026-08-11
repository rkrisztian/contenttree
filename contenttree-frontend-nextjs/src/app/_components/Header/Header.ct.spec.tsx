import { HttpResponse, http } from "msw";
import type { ReactNode } from "react";
import { describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render, renderHook } from "vitest-browser-react/pure";
import { useBackendApi } from "@/app/_lib/BackendApiContext";
import { useTreePage } from "@/app/tree/_lib/TreePageContext";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { WithTreePageContextProvider } from "@/test-utils/test-providers";
import { WithTestI18nProvider } from "../../../test-utils/test-i18n";
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

      await expect.element(page.getByLabelText("Loading")).toBeVisible();

      await vi.waitUntil(() => resolveRequest);
      resolveRequest();

      await expect.element(page.getByLabelText("Loading")).not.toBeInTheDocument();
    });
  });

  describe("Error notifications menu", () => {
    it("shows error badge count when there are no errors", async () => {
      await render(<HeaderWithTreePageContextProvider />);

      await expect
        .element(page.getByLabelText("Error notifications", { exact: true }))
        .toBeVisible();
    });

    it("shows error badge count when there are errors", async ({ worker }) => {
      worker.use(
        http.get(`${TREE_API_BASE_URL}`, () => {
          return HttpResponse.error();
        }),
      );

      const { result: hooks, act } = await renderHook(
        () => ({ backendApiContext: useBackendApi(), treePageContext: useTreePage() }),
        { wrapper: HeaderWithTreePageContextProvider },
      );

      await expect
        .element(page.getByLabelText("Error notifications, 1 error", { exact: true }))
        .toBeVisible();

      await act(async () => hooks.current.treePageContext.rawNodes.mutate());

      await expect
        .element(page.getByLabelText("Error notifications, 2 errors", { exact: true }))
        .toBeVisible();
    });
  });
});
