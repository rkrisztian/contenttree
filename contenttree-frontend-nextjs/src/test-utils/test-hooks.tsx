import { act, renderHook } from "@testing-library/react";
import { type ReactNode, Suspense } from "react";
import { vi } from "vitest";
import { type BackendApiContextType, useBackendApi } from "@/app/_lib/BackendApiContext";
import { ErrorBoundary } from "@/app/_lib/ErrorBoundary";
import { type TreePageContextType, useTreePage } from "@/app/tree/_lib/TreePageContext";
import { WithTreePageContextProvider } from "./test-providers";

export type TreePageContextHooks = {
  current: { backendApiContext: BackendApiContextType; treePageContext: TreePageContextType };
};

export const renderTreePageContextHooks = async (): Promise<TreePageContextHooks> =>
  (
    await act(async () =>
      renderHook(() => ({ backendApiContext: useBackendApi(), treePageContext: useTreePage() }), {
        wrapper: ({ children }: Readonly<{ children: ReactNode }>) => {
          return (
            <WithTreePageContextProvider>
              <TestTreePage>{children}</TestTreePage>
            </WithTreePageContextProvider>
          );
        },
      }),
    )
  ).result;

const TestTreePage = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { contentForSelectedNode } = useTreePage();

  return (
    <>
      {children}
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          {/* Trigger effect for setting default selected node */}
          {contentForSelectedNode.data && ""}
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export const waitForTreePageContextToLoad = async (hooks: TreePageContextHooks) => {
  await act(async () => vi.waitUntil(() => !hooks.current.treePageContext.rawNodes.isLoading));
  await act(async () =>
    vi.waitUntil(() => !hooks.current.treePageContext.contentForSelectedNode.isLoading),
  );
};
