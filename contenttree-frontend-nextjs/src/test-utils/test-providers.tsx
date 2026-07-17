import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { vi } from "vitest";
import { AuthContext, AuthContextProvider } from "@/app/_lib/AuthContext";
import { BackendApiContextProvider, useBackendApi } from "@/app/_lib/BackendApiContext";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";
import { LOGIN_DATA } from "./msw-mocks";

export const WithTreePageContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <WithBackendApiContextProvider>
      <WithMockAuthContext>
        <TreePageContextProvider>{children}</TreePageContextProvider>
      </WithMockAuthContext>
    </WithBackendApiContextProvider>
  );
};

export const WithAuthContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <WithBackendApiContextProvider>
    <AuthContextProvider>{children}</AuthContextProvider>
  </WithBackendApiContextProvider>
);

export const WithBackendApiContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <BackendApiContextProvider>
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      <WaitForRemoteConfig>{children}</WaitForRemoteConfig>
    </SWRConfig>
  </BackendApiContextProvider>
);

export const WithMockAuthContext = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <AuthContext.Provider
      value={{
        loginData: {
          ...LOGIN_DATA,
          expiration: new Date(LOGIN_DATA.expiration),
        },
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        isManager: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const WaitForRemoteConfig = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { remoteConfigLoading } = useBackendApi();

  return remoteConfigLoading ? <p>Loading...</p> : children;
};
