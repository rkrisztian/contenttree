import { ContentRespDto } from '../app/api/tree-api.service';
import { TreeNodeData } from '../app/tree-page/tree-page.service';
import { TreeApiServiceMockData } from './mock-factory';

export const treeApiServiceMockDataForHappyCase: TreeApiServiceMockData = {
  flatNodes: [
    { id: 1, name: 'Root node' },
    { id: 2, name: 'Child node', parentId: 1 },
    { id: 3, name: 'Child node 2', parentId: 1 },
    { id: 4, name: 'Grandchild node', parentId: 2 },
  ],

  contentForSelectedNode: (selectedNode: TreeNodeData): ContentRespDto => {
    switch (selectedNode.id) {
      case 1:
        return { data: 'Content for root node' };
      case 2:
        return { data: 'Content for child node' };
      case 3:
        return { data: 'Content for child node 2' };
      case 4:
        return { data: 'Content for grandchild node' };
      default:
        throw new Error(`Unexpected ID: ${selectedNode.id}`);
    }
  },

  foundNodes: (searchText: string): number[] => {
    return searchText === 'Grand' ? [4] : [];
  },

  flatNodesAfterMove: (nodeId: number, newParentId: number) => {
    if (nodeId === 4 && newParentId === 1) {
      return [
        { id: 1, name: 'Root node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
      ];
    }

    throw new Error(`Unexpected move: ${nodeId} to ${newParentId}`);
  },
};
