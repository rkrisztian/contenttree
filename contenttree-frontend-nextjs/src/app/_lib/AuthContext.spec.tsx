import { act } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, vi } from "vitest";
import { LOGIN_DATA, TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { it } from "@/test-utils/msw-test";
import { renderAuthContextHooks } from "@/test-utils/test-hooks";
import { REMOTE_CONFIG_PATH } from "../api/config/route";
import { TreeApi } from "../tree/_lib/tree-api";
import { LOGIN_DATA_KEY, type LoginData } from "./AuthContext";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("AuthApiContext", () => {
  const TEST_LOGIN_DATA = {
    ...LOGIN_DATA,
    expiration: new Date(LOGIN_DATA.expiration),
  } as LoginData;

  afterEach(async () => {
    localStorage.removeItem(LOGIN_DATA_KEY);
    vi.clearAllMocks();
  });

  describe("login data", () => {
    it("should initialize from localStorage when stored", async () => {
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(TEST_LOGIN_DATA));
      const hooks = await renderAuthContextHooks();

      expect.soft(hooks.current.authContext.loginData).toEqual(TEST_LOGIN_DATA);
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

      await act(() => hooks.current.authContext.logout());

      expect.soft(hooks.current.authContext.loginData).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });
  });

  describe("autoLogOutIfLoginExpired", () => {
    it("should return false and do nothing when login data is not expired", async ({ server }) => {
      localStorage.setItem(
        LOGIN_DATA_KEY,
        JSON.stringify({
          ...TEST_LOGIN_DATA,
          expiration: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
        }),
      );
      server.use(
        http.get(TREE_API_BASE_URL, () => {
          return HttpResponse.json([{ id: 1, name: "Root node" }]);
        }),
      );
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        expect(
          new TreeApi(hooks.current.backendApiContext.backendApiRef).getFlatNodes(),
        ).resolves.toBeDefined(),
      );

      expect.soft(hooks.current.authContext.loginData).not.toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeTruthy();
    });

    it("should return true, clear data, and navigate to login when expired", async ({ server }) => {
      localStorage.setItem(
        LOGIN_DATA_KEY,
        JSON.stringify({
          ...TEST_LOGIN_DATA,
          expiration: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        }),
      );
      server.use(
        http.get(TREE_API_BASE_URL, () => {
          return HttpResponse.json([{ id: 1, name: "Root node" }]);
        }),
      );
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        expect(
          new TreeApi(hooks.current.backendApiContext.backendApiRef).getFlatNodes(),
        ).rejects.toThrow(),
      );

      expect.soft(hooks.current.authContext.loginData).toBeNull();
      expect.soft(localStorage.getItem(LOGIN_DATA_KEY)).toBeNull();
    });

    it("should handle null login data gracefully", async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => {
          return HttpResponse.json([{ id: 1, name: "Root node" }]);
        }),
      );
      const hooks = await renderAuthContextHooks();

      await act(async () =>
        expect(
          new TreeApi(hooks.current.backendApiContext.backendApiRef).getFlatNodes(),
        ).resolves.toBeDefined(),
      );
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
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(TEST_LOGIN_DATA));
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
  });
});
