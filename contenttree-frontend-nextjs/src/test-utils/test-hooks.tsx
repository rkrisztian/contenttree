import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { type AuthContextType, useAuthContext } from "@/app/_lib/AuthContext";
import { type BackendApiContextType, useBackendApi } from "@/app/_lib/BackendApiContext";
import { type TreePageContextType, useTreePage } from "@/app/tree/_lib/TreePageContext";
import { WithAuthContextProvider, WithTreePageContextProvider } from "./test-providers";

export type TreePageContextHooks = {
  current: { backendApiContext: BackendApiContextType; treePageContext: TreePageContextType };
};

export const renderTreePageContextHooks = async (): Promise<TreePageContextHooks> =>
  (
    await act(() =>
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

export type AuthContextHooks = {
  current: { backendApiContext: BackendApiContextType; authContext: AuthContextType };
};

export const renderAuthContextHooks = async (): Promise<AuthContextHooks> =>
  (
    await act(() =>
      renderHook(() => ({ backendApiContext: useBackendApi(), authContext: useAuthContext() }), {
        wrapper: WithAuthContextProvider,
      }),
    )
  ).result;
