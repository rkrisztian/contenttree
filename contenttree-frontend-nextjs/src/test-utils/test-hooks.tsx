import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { type BackendApiContextType, useBackendApi } from "@/app/_lib/BackendApiContext";
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

      {/* Trigger effect for setting default selected node */}
      {contentForSelectedNode.data && ""}
    </>
  );
};
