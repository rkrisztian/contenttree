import { beforeEach, describe, expect, it } from "vitest";
import type { TreeNodeRespDTO } from "./tree-api";
import { TreeData } from "./tree-data";
import { TreeExpansionState } from "./tree-expansion-state";

describe("TreeExpansionState", () => {
  const testRawNodes: TreeNodeRespDTO[] = [
    { id: 1, name: "Root node" },
    { id: 2, name: "Child node 1", parentId: 1 },
    { id: 3, name: "Grandchild node", parentId: 2 },
    { id: 4, name: "Child node 2", parentId: 1 },
  ];

  let treeData: TreeData;
  let expansionState: TreeExpansionState;

  beforeEach(() => {
    treeData = new TreeData(testRawNodes);
    expansionState = new TreeExpansionState();
  });

  describe("initial state", () => {
    it("should start with all nodes expanded and visible", () => {
      expect
        .soft(testRawNodes.map((node) => expansionState.isExpanded(node.id)))
        .toEqual([true, true, true, true]);
      expect
        .soft(testRawNodes.map((node) => expansionState.isVisible(node.id)))
        .toEqual([true, true, true, true]);
    });
  });

  describe("toggleExpanded", () => {
    it("should collapse a node and hide its descendants", () => {
      expansionState.toggleExpanded(1, treeData);

      expect.soft(expansionState.isExpanded(1)).toBe(false);
      expect
        .soft(testRawNodes.map((node) => expansionState.isVisible(node.id)))
        .toEqual([true, false, false, false]);
    });

    it("should expand a collapsed node and show its descendants if ancestors are expanded", () => {
      expansionState.toggleExpanded(1, treeData);
      expansionState.toggleExpanded(1, treeData);

      expect.soft(expansionState.isExpanded(1)).toBe(true);
      expect
        .soft(testRawNodes.map((node) => expansionState.isVisible(node.id)))
        .toEqual([true, true, true, true]);
    });

    it("should hide children of collapsed node", () => {
      expansionState.toggleExpanded(2, treeData);

      expect.soft(expansionState.isExpanded(2)).toBe(false);
      expect
        .soft(testRawNodes.map((node) => expansionState.isVisible(node.id)))
        .toEqual([true, true, false, true]);
    });
  });

  describe("sync", () => {
    it("should remove collapsed IDs that no longer exist in treeData", () => {
      expansionState.toggleExpanded(2, treeData);

      expect(expansionState.isExpanded(2)).toBe(false);

      const newTreeData = new TreeData([{ id: 1, name: "Root" }]);
      expansionState.sync(newTreeData);

      expect(expansionState.isExpanded(2)).toBe(true);
    });
  });
});
