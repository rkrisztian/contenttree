import { act } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { TREE_API_BASE_PATH } from "@/app/tree/_lib/tree-api";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { it } from "@/test-utils/msw-test";
import { renderTreePageContextHooks, type TreePageContextHooks } from "@/test-utils/test-hooks";
import type { ErrorData } from "./BackendApiContext";

describe("BackendApiContext", () => {
  describe("AppConfigService", () => {
    it("should load remote config", async () => {
      const hooks = await renderTreePageContextHooks();

      expect(hooks.current.backendApiContext.remoteConfigLoading).toBeFalsy();
      expect(hooks.current.backendApiContext.backendApiRef.current.defaults.baseURL).toEqual(
        process.env["API_BASE_URL"],
      );
    });
  });

  describe("Axios interceptor", () => {
    it("should show error on missing backend connection", async ({ server }) => {
      server.use(
        http.post(`${TREE_API_BASE_URL}/move`, () => {
          return HttpResponse.error();
        }),
      );
      const hooks = await renderTreePageContextHooks();

      await act(async () =>
        expect(hooks.current.treePageContext.moveNode(2, 3)).rejects.toThrow(
          expect.objectContaining({
            name: "AxiosError",
            request: expect.objectContaining({ status: 0 }),
          }),
        ),
      );
      expect(hooks.current.backendApiContext.latestError).toMatchObject(
        expect.objectContaining({ error: "Unexpected error" }),
      );
    });

    it("should show error with trace ID on bad response", async ({ server }) => {
      server.use(
        http.post(`${TREE_API_BASE_URL}/move`, () => {
          return HttpResponse.json(
            {
              status: 400,
              error: "Content tree service error",
              message: "Node cannot be moved into a descendant",
              path: `${TREE_API_BASE_PATH}/move`,
              traceId: "0123456789abcdef0123456789abcdef",
              trace: "Node cannot be moved into a descendant",
              timestamp: "2026-01-01T11:12:13.001234567Z",
            },
            { status: 400 },
          );
        }),
      );

      const hooks = await renderTreePageContextHooks();

      await act(async () =>
        expect(hooks.current.treePageContext.moveNode(2, 3)).rejects.toThrow(
          expect.objectContaining({
            name: "AxiosError",
            request: expect.objectContaining({ status: 400 }),
          }),
        ),
      );
      act(() =>
        expect(hooks.current.backendApiContext.latestError).toMatchObject({
          error: "Content tree service error",
          message: "Node cannot be moved into a descendant",
          traceId: "0123456789abcdef0123456789abcdef",
        }),
      );
    });

    it("should set loading state on network connection", async ({ server }) => {
      let resolveRequest!: () => void;

      server.use(
        http.get(
          `${TREE_API_BASE_URL}/content/:id`,
          () =>
            new Promise((resolve) => {
              resolveRequest = () => {
                resolve(HttpResponse.json({ data: "dummy content" }));
              };
            }),
        ),
      );

      const hooks = await renderTreePageContextHooks();

      await act(async () =>
        vi.waitUntil(() => hooks.current.treePageContext.contentForSelectedNode.isLoading),
      );

      expect(hooks.current.backendApiContext.loading).toBeTruthy();

      resolveRequest();
      await act(async () =>
        vi.waitUntil(() => !hooks.current.treePageContext.contentForSelectedNode.isLoading),
      );

      expect(hooks.current.backendApiContext.loading).toBeFalsy();
    });
  });

  describe("Error handler", () => {
    let hooks: TreePageContextHooks;

    beforeEach(async () => {
      vi.useFakeTimers();
      hooks = await renderTreePageContextHooks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it("should initialize errorData as empty", () => {
      expect(hooks.current.backendApiContext.errors).toEqual([]);
    });

    it("should update errors when addAndShowError is called", () => {
      const errorData = { error: "Dummy error", message: "Dummy message." };

      addError(errorData);

      expect.soft(hooks.current.backendApiContext.errors).toMatchObject([errorData]);
      expect.soft(hooks.current.backendApiContext.latestError).toMatchObject(errorData);
    });

    it("should store all errors", () => {
      const errorData1 = { error: "Dummy error", message: "Dummy message." };
      const errorData2 = { error: "Dummy error 2", message: "Dummy message 2." };

      addError(errorData1);
      addError(errorData2);

      expect.soft(hooks.current.backendApiContext.errors).toMatchObject([errorData2, errorData1]);
      expect.soft(hooks.current.backendApiContext.latestError).toMatchObject(errorData2);
    });

    it("should hide latest error", () => {
      const errorData1 = addError({ error: "Dummy error", message: "Dummy message." });
      const errorData2 = addError({ error: "Dummy error 2", message: "Dummy message 2." });

      act(() => hooks.current.backendApiContext.hideLatestError());

      expect.soft(hooks.current.backendApiContext.errors).toEqual([errorData2, errorData1]);
      expect.soft(hooks.current.backendApiContext.latestError).toBeNull();
    });

    it("should remove errorData from errors when deleted", () => {
      const errorData1 = addError({ error: "Dummy error", message: "Dummy message." });
      const errorData2 = addError({ error: "Dummy error 2", message: "Dummy message 2." });

      act(() => hooks.current.backendApiContext.removeError(errorData1.id));

      expect.soft(hooks.current.backendApiContext.errors).toEqual([errorData2]);
      expect.soft(hooks.current.backendApiContext.latestError).toEqual(errorData2);
    });

    it("should hide latest error when deleted", () => {
      const errorData1 = addError({ error: "Dummy error", message: "Dummy message." });
      const errorData2 = addError({ error: "Dummy error 2", message: "Dummy message 2." });

      act(() => hooks.current.backendApiContext.removeError(errorData2.id));

      expect.soft(hooks.current.backendApiContext.errors).toEqual([errorData1]);
      expect.soft(hooks.current.backendApiContext.latestError).toBeNull();
    });

    it("should reset errors to empty when last error becomes deleted", () => {
      const errorData1 = addError({ error: "Dummy error", message: "Dummy message." });

      act(() => hooks.current.backendApiContext.removeError(errorData1.id));

      expect.soft(hooks.current.backendApiContext.errors).toEqual([]);
      expect.soft(hooks.current.backendApiContext.latestError).toBeNull();
    });

    const addError = (newErrorData: Omit<ErrorData, "id">): ErrorData => {
      act(() => hooks.current.backendApiContext.addAndShowError(newErrorData));
      return hooks.current.backendApiContext.latestError!;
    };
  });
});
