import { HttpResponse, http } from "msw";
import { act } from "react";
import { describe, expect } from "vitest";
import { TREE_API_BASE_URL } from "@/test-utils/msw-mocks";
import { it } from "@/test-utils/msw-test";
import { renderTreePageContextHooks } from "@/test-utils/tree-page-provider";
import type { ContentRespDto, TreeNodeRespDTO } from "./tree-api";

describe("TreePageContext", () => {
  const testFlatNodes: TreeNodeRespDTO[] = [
    { id: 1, name: "Root node" },
    { id: 2, name: "Child node", parentId: 1 },
    { id: 3, name: "Child node 2", parentId: 1 },
    { id: 4, name: "Grandchild node", parentId: 2 },
  ];
  const content: ContentRespDto = {
    data: "test content",
  };

  describe("rootNode and contentForSelectedNode", () => {
    it("should load a one-node tree with content", async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => HttpResponse.json([{ id: 1, name: "dummy name" }])),
        http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
          expect(params["id"]).toEqual("1");
          return HttpResponse.json(content);
        }),
      );

      const hooks = await renderTreePageContextHooks();

      expect.soft(hooks.current.treePageContext.rootNode).toHaveProperty("id", 1);
      expect.soft(hooks.current.treePageContext.contentForSelectedNode.data).toEqual(content);
    });

    it("should map child elements to parent", async () => {
      const hooks = await renderTreePageContextHooks();

      expect(hooks.current.treePageContext.rootNode).toMatchObject({
        id: 1,
        children: [
          expect.objectContaining({ id: 2, children: [expect.objectContaining({ id: 4 })] }),
          expect.objectContaining({ id: 3 }),
        ],
      });
    });

    it("should return null if there are no elements", async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => HttpResponse.json([])),
        http.get(`${TREE_API_BASE_URL}/content/:id`, () => {
          throw new Error("Not expected to be called");
        }),
      );

      const hooks = await renderTreePageContextHooks();

      expect(hooks.current.treePageContext.rootNode).toBeNullable();
      expect(hooks.current.treePageContext.contentForSelectedNode.data).toBeNullable();
    });
  });

  describe("moveNode", () => {
    it.for([
      {
        name: "should move node with valid inputs",
        nodeId: 4,
        newParentId: 1,
        shouldFail: false,
        expectedFlatNodes: {
          id: 1,
          children: [
            expect.objectContaining({ id: 2, children: [expect.objectContaining({ id: 4 })] }),
            expect.objectContaining({ id: 3 }),
          ],
        },
      },
      {
        name: "should not move node to self",
        nodeId: 2,
        newParentId: 2,
        shouldFail: true,
      },
      {
        name: "should not move root node",
        nodeId: 1,
        newParentId: 2,
        shouldFail: true,
      },
      {
        name: "should not move node to same parent",
        nodeId: 2,
        newParentId: 1,
        shouldFail: true,
      },
      {
        name: "should not move node to descendant node",
        nodeId: 2,
        newParentId: 4,
        shouldFail: true,
      },
    ])("$name", async ({ nodeId, newParentId, shouldFail, expectedFlatNodes }, { server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => {
          return HttpResponse.json(testFlatNodes);
        }),
      );

      const hooks = await renderTreePageContextHooks();

      await act(async () => hooks.current.treePageContext.moveNode(nodeId, newParentId));

      if (shouldFail) {
        expect
          .soft(hooks.current.backendApiContext.latestError, "should display error")
          .toBeDefined();
        expect.soft(hooks.current.treePageContext.rootNode).toMatchObject({
          id: 1,
          children: [
            expect.objectContaining({ id: 2, children: [expect.objectContaining({ id: 4 })] }),
            expect.objectContaining({ id: 3 }),
          ],
        });
      } else {
        expect
          .soft(hooks.current.backendApiContext.latestError, "should not display error")
          .toBeNull();
        expect.soft(hooks.current.treePageContext.rootNode).toMatchObject(expectedFlatNodes!);
      }
    });
  });
});
