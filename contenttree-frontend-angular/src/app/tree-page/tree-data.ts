import type { TreeNodeRespDTO } from '../api/types';

export interface TreeNodeData {
  id: number;
  name: string;
  parentId: number | null;
  children: number[];
  depth: number;
}

/**
 * Converts flat array to tree nodes with depth, returning:
 * - `nodes`: Array of nodes (for iteration/list rendering),
 * - `nodesById`: Map for O(1) lookups
 * - `rootNodeId`: ID of the root node.
 */
export class TreeData {
  readonly nodes: TreeNodeData[];
  readonly nodesById: Map<number, TreeNodeData>;
  readonly rootNodeId: number | null;
  private readonly idToIndex: Map<number, number>;

  constructor(rawNodes: TreeNodeRespDTO[] = []) {
    this.nodesById = this.initializeNodes(rawNodes);
    this.rootNodeId = this.calculateRootAndChildren();
    this.nodes = this.calculateDepthAndIterationOrder();
    this.idToIndex = this.calculateIdToIndexMap();
  }

  private readonly initializeNodes = (rawNodes: TreeNodeRespDTO[]): Map<number, TreeNodeData> =>
    new Map(
      rawNodes.map((node) => [
        node.id,
        {
          id: node.id,
          name: node.name,
          parentId: node.parentId ?? null,
          children: [],
          depth: -1,
        } satisfies TreeNodeData,
      ]),
    );

  private readonly calculateRootAndChildren = () => {
    let rootNodeId: number | null = null;

    for (const node of this.nodesById.values()) {
      if (node.parentId === null) {
        rootNodeId = node.id;
      } else {
        const parent = this.getNodebyId(node.parentId)!;
        parent.children.push(node.id);
      }
    }

    return rootNodeId;
  };

  private readonly calculateDepthAndIterationOrder = () => {
    const nodes: TreeNodeData[] = [];

    if (this.rootNodeId === null) {
      return nodes;
    }

    const stack: { nodeId: number; depth: number }[] = [{ nodeId: this.rootNodeId, depth: 0 }];

    while (stack.length > 0) {
      const { nodeId, depth } = stack.pop()!;
      const node = this.getNodebyId(nodeId);
      node.depth = depth;
      node.children.sort((a, b) =>
        this.getNodebyId(a).name.localeCompare(this.getNodebyId(b).name, 'en'),
      );
      nodes.push(node);

      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ nodeId: node.children[i]!, depth: depth + 1 });
      }
    }

    return nodes;
  };

  private readonly calculateIdToIndexMap = () =>
    new Map(this.nodes.map((node, index) => [node.id, index]));

  readonly isValidMove = (nodeId: number, newParentId: number) =>
    nodeId !== newParentId &&
    !this.isRoot(nodeId) &&
    !this.isParent(newParentId, nodeId) &&
    !this.isDescendant(newParentId, nodeId);

  private readonly isRoot = (nodeId: number): boolean => {
    return this.rootNodeId === nodeId;
  };

  private readonly isParent = (newParentId: number, nodeId: number): boolean =>
    this.getNodebyId(nodeId).parentId === newParentId;

  /** Checks if the node with ID `newParentId` is a descendant of that with `nodeId`. */
  private readonly isDescendant = (newParentId: number, nodeId: number): boolean => {
    let currentId: number | null = newParentId;

    do {
      currentId = this.getNodebyId(currentId).parentId;

      if (currentId === nodeId) {
        return true;
      }
    } while (currentId != null);

    return false;
  };

  readonly getNodebyId = (nodeId: number) => this.nodesById.get(nodeId)!;

  *iterateSubTree(nodeId: number) {
    const startIndex = this.idToIndex.get(nodeId)!;

    yield this.nodes[startIndex]!;

    for (
      let i = startIndex + 1;
      i < this.nodes.length && this.nodes[i]!.depth > this.nodes[startIndex]!.depth;
      i++
    ) {
      yield this.nodes[i]!;
    }
  }
}
