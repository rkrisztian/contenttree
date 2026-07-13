import { describe, expect, it } from "vitest";
import type { TreeNodeRespDTO } from "./tree-api";
import { TreeData } from "./tree-data";

describe("TreeData", () => {
  describe("initialization", () => {
    it("should handle empty input", () => {
      const treeData = new TreeData();

      expect.soft(treeData.nodes).toHaveLength(0);
      expect.soft(treeData.rootNodeId).toBeNull();
      expect.soft(treeData.nodesById.size).toBe(0);
    });

    it("should correctly parse flat nodes into a tree structure", () => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node 1", parentId: 1 },
        { id: 3, name: "Grandchild node", parentId: 2 },
        { id: 4, name: "Child node 2", parentId: 1 },
      ];

      const treeData = new TreeData(testRawNodes);
      const rootNode = treeData.getNodebyId(1);
      const child1Node = treeData.getNodebyId(2);

      expect.soft(treeData.rootNodeId).toBe(1);
      expect.soft(treeData.nodesById.has(1)).toBe(true);
      expect.soft(treeData.nodes).toHaveLength(4);
      expect.soft(rootNode.children).toContain(2);
      expect.soft(rootNode.children).toContain(4);
      expect.soft(child1Node.children).toContain(3);
    });

    it("should sort children alphabetically by name", () => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Zebra", parentId: 1 },
        { id: 3, name: "Alpha", parentId: 1 },
      ];

      const treeData = new TreeData(testRawNodes);
      const rootNode = treeData.getNodebyId(1);

      expect(rootNode.children).toEqual([3, 2]);
    });
  });

  describe("depth calculation", () => {
    it("should calculate correct depth for nested nodes", () => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node 1", parentId: 1 },
        { id: 3, name: "Grandchild node", parentId: 2 },
      ];

      const treeData = new TreeData(testRawNodes);

      expect.soft(treeData.getNodebyId(1).depth).toBe(0);
      expect.soft(treeData.getNodebyId(2).depth).toBe(1);
      expect.soft(treeData.getNodebyId(3).depth).toBe(2);
    });
  });

  describe("iteration", () => {
    it("should return nodes in depth-first order via nodes array", () => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node 1", parentId: 1 },
        { id: 3, name: "Grandchild node", parentId: 2 },
        { id: 4, name: "Child node 2", parentId: 1 },
      ];

      const treeData = new TreeData(testRawNodes);

      expect.soft(treeData.nodes.map((node) => node.id)).toEqual([1, 2, 3, 4]);
    });

    it("should iterate subtree correctly", () => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node 1", parentId: 1 },
        { id: 3, name: "Grandchild node 1", parentId: 2 },
        { id: 4, name: "Grandchild node 2", parentId: 2 },
        { id: 5, name: "Child node 2", parentId: 1 },
      ];

      const treeData = new TreeData(testRawNodes);

      expect(Array.from(treeData.iterateSubTree(1)).map((n) => n.id)).toEqual([1, 2, 3, 4, 5]);
      expect(Array.from(treeData.iterateSubTree(2)).map((n) => n.id)).toEqual([2, 3, 4]);
    });
  });

  describe("isValidMove", () => {
    it.each([
      {
        name: "should move node with valid inputs",
        nodeId: 4,
        newParentId: 1,
        valid: true,
      },
      {
        name: "should not move node to self",
        nodeId: 2,
        newParentId: 2,
        valid: false,
      },
      {
        name: "should not move root node",
        nodeId: 1,
        newParentId: 2,
        valid: false,
      },
      {
        name: "should not move node to same parent",
        nodeId: 2,
        newParentId: 1,
        valid: false,
      },
      {
        name: "should not move node to descendant node",
        nodeId: 2,
        newParentId: 4,
        valid: false,
      },
    ])("$name", ({ nodeId, newParentId, valid }) => {
      const testRawNodes: TreeNodeRespDTO[] = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node", parentId: 1 },
        { id: 3, name: "Child node 2", parentId: 1 },
        { id: 4, name: "Grandchild node", parentId: 2 },
      ];

      const treeData = new TreeData(testRawNodes);

      expect(treeData.isValidMove(nodeId, newParentId)).toBe(valid);
    });
  });
});
