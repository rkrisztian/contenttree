import type { TreeNodeData } from "@/app/tree/_lib/TreePageContext";

export interface TreeNodeAsListItem {
  node: TreeNodeData;
  indentLevel: number;
}

export const convertTreeToList = (selectedNode: TreeNodeData): TreeNodeAsListItem[] => {
  const treeAsList: TreeNodeAsListItem[] = [];
  const stack: TreeNodeAsListItem[] = [{ node: selectedNode, indentLevel: 0 }];

  while (stack.length) {
    const currentItem = stack.pop()!;
    const children = currentItem.node.children;

    treeAsList.push(currentItem);

    for (let i = children.length - 1; i >= 0; i--) {
      stack.push({
        node: children[i]!,
        indentLevel: currentItem.indentLevel + 1,
      });
    }
  }

  return treeAsList;
};
