import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { vi } from "vitest";
import { AbortContextProvider } from "@/app/_lib/AbortContext";
import { AuthContext } from "@/app/_lib/AuthContext";
import { BackendApiContextProvider, useBackendApi } from "@/app/_lib/BackendApiContext";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";
import { LOGIN_DATA } from "./test-data";

export const WithTreePageContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <WithBackendApiContextProvider>
      <WithMockAuthContext>
        <AbortContextProvider>
          <WaitForRemoteConfig>
            <TreePageContextProvider>{children}</TreePageContextProvider>
          </WaitForRemoteConfig>
        </AbortContextProvider>
      </WithMockAuthContext>
    </WithBackendApiContextProvider>
  );
};

export const WithBackendApiContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <BackendApiContextProvider>
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      {children}
    </SWRConfig>
  </BackendApiContextProvider>
);

const WithMockAuthContext = ({ children }: Readonly<{ children: ReactNode }>) => (
  <AuthContext.Provider
    value={{
      loginData: LOGIN_DATA,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isManager: true,
    }}
  >
    {children}
  </AuthContext.Provider>
);

export const WaitForRemoteConfig = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { remoteConfig } = useBackendApi();

  return remoteConfig ? children : <p>Loading...</p>;
};
