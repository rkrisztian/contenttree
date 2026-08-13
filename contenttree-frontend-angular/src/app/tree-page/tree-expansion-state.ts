import type { TreeData } from '@/app/tree-page/tree-data';

export class TreeExpansionState {
  private readonly collapsedIds: Set<number>;
  private readonly hiddenIds: Set<number>;

  constructor() {
    this.collapsedIds = new Set([]);
    this.hiddenIds = new Set([]);
  }

  readonly isExpanded = (nodeId: number): boolean => !this.collapsedIds.has(nodeId);

  readonly isVisible = (nodeId: number): boolean => !this.hiddenIds.has(nodeId);

  readonly toggleExpanded = (nodeId: number, treeData: TreeData): void => {
    if (this.collapsedIds.has(nodeId)) {
      this.collapsedIds.delete(nodeId);
    } else {
      this.collapsedIds.add(nodeId);
    }

    this.computeVisibility(nodeId, treeData);
  };

  readonly computeVisibility = (toggledNodeId: number, treeData: TreeData) => {
    for (const node of treeData.iterateSubTree(toggledNodeId)) {
      if (node.id === toggledNodeId) continue;

      let isVisible = true;

      for (
        let currentParentId = node.parentId;
        currentParentId != null;
        currentParentId = treeData.getNodebyId(currentParentId).parentId
      ) {
        if (!this.isVisible(currentParentId) || !this.isExpanded(currentParentId)) {
          isVisible = false;
          break;
        }
      }

      if (isVisible) {
        this.hiddenIds.delete(node.id);
      } else {
        this.hiddenIds.add(node.id);
      }
    }
  };

  readonly sync = (treeData: TreeData): void => {
    for (const nodeId of this.collapsedIds) {
      if (!treeData.nodesById.has(nodeId)) {
        this.collapsedIds.delete(nodeId);
      }
    }
  };

  readonly isEqual = (other: TreeExpansionState): boolean => {
    if (this.collapsedIds.size !== other.collapsedIds.size) return false;

    for (const id of this.collapsedIds) {
      if (!other.collapsedIds.has(id)) return false;
    }

    return true;
  };
}
