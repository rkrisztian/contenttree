import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { vi } from "vitest";
import { AbortContextProvider } from "@/app/_lib/AbortContext";
import { AuthContext } from "@/app/_lib/AuthContext";
import { BackendApiContextProvider } from "@/app/_lib/BackendApiContext";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";
import { TEST_LOGIN_DATA, TEST_REMOTE_CONFIG } from "./test-data";

export const WithTreePageContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <WithBackendApiContextProvider>
      <WithMockAuthContext>
        <AbortContextProvider>
          <TreePageContextProvider>{children}</TreePageContextProvider>
        </AbortContextProvider>
      </WithMockAuthContext>
    </WithBackendApiContextProvider>
  );
};

export const WithBackendApiContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <BackendApiContextProvider remoteConfig={TEST_REMOTE_CONFIG}>
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
      loginData: TEST_LOGIN_DATA,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isManager: true,
    }}
  >
    {children}
  </AuthContext.Provider>
);
