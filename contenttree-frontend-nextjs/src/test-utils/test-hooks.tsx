import { renderHook } from "@testing-library/react";
import { act } from "react";
import { type AuthContextType, useAuthContext } from "@/app/_lib/AuthContext";
import { type BackendApiContextType, useBackendApi } from "@/app/_lib/BackendApiContext";
import { type TreePageContextType, useTreePage } from "@/app/tree/_lib/TreePageContext";
import { WithAuthContextProvider, WithTreePageContextProvider } from "./test-providers";

export type TreePageContextHooks = {
  current: { backendApiContext: BackendApiContextType; treePageContext: TreePageContextType };
};

export const renderTreePageContextHooks = async (): Promise<TreePageContextHooks> => {
  const hooks = (
    await act(() =>
      renderHook(() => ({ backendApiContext: useBackendApi(), treePageContext: useTreePage() }), {
        wrapper: WithTreePageContextProvider,
      }),
    )
  ).result;

  // // TODO: `contentForSelectedNode` is stuck in loading state on initial load via `useEffect`
  act(() => hooks.current.treePageContext.contentForSelectedNode.isLoading);
  act(() => {
    if (hooks.current.treePageContext.treeData.rootNodeId) {
      hooks.current.treePageContext.toggleSelect(hooks.current.treePageContext.treeData.rootNodeId);
      hooks.current.treePageContext.toggleSelect(hooks.current.treePageContext.treeData.rootNodeId);
    }
  });

  return hooks;
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
