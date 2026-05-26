import { Injectable } from '@angular/core';
import { TreeNodeData } from '../tree-page.service';

export interface TreeListingItem {
  node: TreeNodeData;
  indentLevel: number;
}

@Injectable({
  providedIn: 'root',
})
export class NodeDeleteDialogService {
  calculateTreeAsList = (selectedNode: TreeNodeData) => {
    const treeAsList: TreeListingItem[] = [];
    const stack: TreeListingItem[] = [{ node: selectedNode, indentLevel: 0 }];

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
}
