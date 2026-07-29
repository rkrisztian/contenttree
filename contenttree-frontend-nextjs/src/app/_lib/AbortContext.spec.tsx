import { act } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, vi } from "vitest";
import type { ContentRespDto } from "@/app/_lib/api/types";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { it } from "@/test-utils/msw-test";
import { renderTreePageContextHooks } from "@/test-utils/test-hooks";

describe("AbortContext", () => {
  describe("useSwrWithAbort", () => {
    it("should abort previous request with the same category", async ({ server }) => {
      const hooks = await renderTreePageContextHooks();
      let resolveRequest!: () => void;

      server.use(
        http.get(`${TREE_API_BASE_URL}/content/:id`, async ({ params }) => {
          expect(params["id"]).toEqual("2");
          return new Promise((resolve) => {
            resolveRequest = () => {
              resolve(
                HttpResponse.json({
                  data: "test content 2",
                } as ContentRespDto),
              );
            };
          });
        }),
      );
      act(() => hooks.current.treePageContext.toggleSelect(2));
      await act(() => vi.waitUntil(() => !!resolveRequest));

      server.use(
        http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
          expect(params["id"]).toEqual("3");
          return HttpResponse.json({
            data: "test content 3",
          } as ContentRespDto);
        }),
      );
      act(() => hooks.current.treePageContext.toggleSelect(3));
      await act(() =>
        vi.waitUntil(() => !hooks.current.treePageContext.contentForSelectedNode.isLoading),
      );

      expect(hooks.current.backendApiContext.loading).toBeFalsy();

      act(() => resolveRequest());

      expect(hooks.current.treePageContext.contentForSelectedNode.data).toEqual({
        data: "test content 3",
      });
    });
  });
});
