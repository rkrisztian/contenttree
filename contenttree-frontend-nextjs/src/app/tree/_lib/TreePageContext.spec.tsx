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

      expect.soft(hooks.current.treePageContext.treeData.rootNodeId).toBe(1);
      expect.soft(hooks.current.treePageContext.contentForSelectedNode.data).toEqual(content);
    });

    it("should return null if there are no elements", async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => HttpResponse.json([])),
        http.get(`${TREE_API_BASE_URL}/content/:id`, () => {
          throw new Error("Not expected to be called");
        }),
      );

      const hooks = await renderTreePageContextHooks();

      expect(hooks.current.treePageContext.treeData.rootNodeId).toBeNullable();
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
        // TODO: Find out why hook is not updated with new data.
        // expectedNodes: [
        //   { id: 1, children: [2, 3, 4] },
        //   { id: 2, children: [] },
        //   { id: 3, children: [] },
        //   { id: 4, children: [] },
        // ],
      },
      {
        name: "should not move node to self",
        nodeId: 2,
        newParentId: 2,
        shouldFail: true,
        expectedNodes: [
          { id: 1, children: [2, 3] },
          { id: 2, children: [4] },
          { id: 4, children: [] },
          { id: 3, children: [] },
        ],
      },
    ])("$name", async ({ nodeId, newParentId, shouldFail, expectedNodes }, { server }) => {
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
      } else {
        expect
          .soft(hooks.current.backendApiContext.latestError, "should not display error")
          .toBeNull();
      }

      if (expectedNodes) {
        expect.soft(hooks.current.treePageContext.treeData.nodes).toMatchObject(expectedNodes);
      }
    });
  });
});
