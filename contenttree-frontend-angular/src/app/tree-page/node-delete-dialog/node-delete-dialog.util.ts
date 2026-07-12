import { TreeNodeData } from '../tree-page.service';

export interface TreeNodeAsListItem {
  node: TreeNodeData;
  indentLevel: number;
}

export const convertTreeToList = (selectedNode: TreeNodeData) => {
  const treeAsList: TreeNodeAsListItem[] = [];
  const stack: TreeNodeAsListItem[] = [{ node: selectedNode, indentLevel: 0 }];

  while (stack.length) {
    const currentItem = stack.pop();
    // @ts-expect-error: False positive
    const children = currentItem.node.children;

    // @ts-expect-error: False positive
    treeAsList.push(currentItem);

    for (let i = children.length - 1; i >= 0; i--) {
      stack.push({
        // @ts-expect-error: False positive
        node: children[i],
        // @ts-expect-error: False positive
        indentLevel: currentItem.indentLevel + 1,
      });
    }
  }

  return treeAsList;
};
