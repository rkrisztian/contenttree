import { act, renderHook } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import type { ReactNode } from "react";
import { afterEach, describe, expect, vi } from "vitest";
import { REMOTE_CONFIG_PATH } from "@/app/api/config/route";
import { TREE_API_BASE_PATH, TreeApi } from "@/app/tree/_lib/tree-api";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { it } from "@/test-utils/msw-test";
import { LOGIN_DATA } from "@/test-utils/test-data";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import {
  AuthContextProvider,
  type AuthContextType,
  LOGIN_DATA_KEY,
  useAuthContext,
} from "./AuthContext";
import { type BackendApiContextType, useBackendApi } from "./BackendApiContext";

type AuthContextHooks = {
  current: { backendApiContext: BackendApiContextType; authContext: AuthContextType };
};

const renderAuthContextHooks = async (): Promise<AuthContextHooks> =>
  (
    await act(() =>
      renderHook(() => ({ backendApiContext: useBackendApi(), authContext: useAuthContext() }), {
        wrapper: WithAuthContextProvider,
      }),
    )
  ).result;

const WithAuthContextProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <WithBackendApiContextProvider>
    <AuthContextProvider>{children}</AuthContextProvider>
  </WithBackendApiContextProvider>
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("AuthApiContext", () => {
  afterEach(async () => {
    localStorage.removeItem(LOGIN_DATA_KEY);
    vi.clearAllMocks();
  });

  describe("login data", () => {
    it("should initialize from localStorage when stored", async () => {
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
      const hooks = await renderAuthContextHooks();

      expect.soft(hooks.current.authContext.loginData).toEqual(LOGIN_DATA);
      expect.soft(hooks.current.authContext.isAuthenticated).toBeTruthy();
    });

    it("should be null when no token in localStorage", async () => {
      const hooks = await renderAuthContextHooks();

      expect.soft(hooks.current.authContext.loginData).toBeNull();
      expect.soft(hooks.current.authContext.isAuthenticated).toBeFalsy();
    });
  });

  describe("login", () => {
    it("should store login data in local storage", async () => {
      const hooks = await renderAuthContextHooks();

      await act(async () => hooks.current.authContext.login("admin", "secret"));

      expect
        .soft(hooks.current.authContext.loginData)
        .toMatchObject({ username: "admin", role: "ADMIN" });
      expect.soft(hooks.current.authContext.loginData?.token).toBeDefined();
      expect
        .soft(JSON.parse(localStorage.getItem(LOGIN_DATA_KEY) ?? "{}"))
        .toMatchObject({ username: "admin", role: "ADMIN" });
    });
  });

  describe("logout", () => {
    it("should clear login data from local storage", async () => {
      const hooks = await renderAuthContextHooks();

      act(() => hooks.current.authContext.logout());

      expect.soft(hooks.current.authContext.loginData).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });
  });

  describe("authInterceptor", () => {
    it("should add Authorization header for tree API when token exists", async ({ server }) => {
      let authorizationHeader: string | null = null;
      server.use(
        http.get(TREE_API_BASE_URL, ({ request }) => {
          authorizationHeader = request.headers.get("Authorization");
          return HttpResponse.json([{ id: 1, name: "Root node" }]);
        }),
      );
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        new TreeApi(hooks.current.backendApiContext.backendApiRef).getFlatNodes(),
      );

      expect(authorizationHeader).toBe(`Bearer ${LOGIN_DATA.token}`);
    });

    it("should not add Authorization header for unprotected API even when logged in", async ({
      server,
    }) => {
      let authorizationHeader: string | null = null;
      server.use(
        http.get(REMOTE_CONFIG_PATH, ({ request }) => {
          authorizationHeader = request.headers.get("Authorization");
          return HttpResponse.json({});
        }),
      );
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        hooks.current.backendApiContext.backendApiRef.current.get(REMOTE_CONFIG_PATH),
      );

      expect(authorizationHeader).toBeNull();
    });

    it("should auto-logout when login is expired", async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => {
          return new HttpResponse(null, { status: 401 });
        }),
      );
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(LOGIN_DATA));
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        expect(
          hooks.current.backendApiContext.backendApiRef.current.get(TREE_API_BASE_PATH),
        ).rejects.toThrow(),
      );

      expect.soft(hooks.current.authContext.isAuthenticated).toBeFalsy();
    });
  });
});
