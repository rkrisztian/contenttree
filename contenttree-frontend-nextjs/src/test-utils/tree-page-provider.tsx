import Typography from "@mui/material/Typography";
import { renderHook } from "@testing-library/react";
import { act, type ReactNode } from "react";
import { SWRConfig } from "swr";
import {
  BackendApiContextProvider,
  type BackendApiContextType,
  useBackendApi,
} from "@/app/_lib/BackendApiContext";
import {
  TreePageContextProvider,
  type TreePageContextType,
  useTreePage,
} from "@/app/tree/_lib/TreePageContext";

export const WithTreePageContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <BackendApiContextProvider>
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      <TestPageWrapper>
        <TreePageContextProvider>{children}</TreePageContextProvider>
      </TestPageWrapper>
    </SWRConfig>
  </BackendApiContextProvider>
);

export default function TestPageWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const { remoteConfigLoading } = useBackendApi();

  return remoteConfigLoading ? <Typography variant="body1">Loading...</Typography> : children;
}

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

  // TODO: `contentForSelectedNode` is stuck in loading state on initial load via `useEffect`
  act(() => hooks.current.treePageContext.contentForSelectedNode.isLoading);
  act(() => {
    if (hooks.current.treePageContext.treeData.rootNodeId) {
      hooks.current.treePageContext.toggleSelect(hooks.current.treePageContext.treeData.rootNodeId);
      hooks.current.treePageContext.toggleSelect(hooks.current.treePageContext.treeData.rootNodeId);
    }
  });

  return hooks;
};
