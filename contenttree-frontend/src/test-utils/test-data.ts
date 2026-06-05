import {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TreeNodeRespDTO,
  UpdateTreeNodeReqDTO,
} from '../app/api/tree-api.service';
import { TreeApiServiceMockData } from './mock-factory';

export const treeApiServiceMockDataForHappyCase: TreeApiServiceMockData = {
  flatNodes: [
    { id: 1, name: 'Root node' },
    { id: 2, name: 'Child node', parentId: 1 },
    { id: 3, name: 'Child node 2', parentId: 1 },
    { id: 4, name: 'Grandchild node', parentId: 2 },
  ],

  contents: {
    1: { data: 'Content for root node' },
    2: { data: 'Content for child node' },
    3: { data: 'Content for child node 2' },
    4: { data: 'Content for grandchild node' },
  },

  flatNodesAfterCreate: (node: CreateTreeNodeReqDTO): TreeNodeRespDTO[] => {
    if (node.name === 'test node') {
      return [
        { id: 1, name: 'Root node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
        { id: 5, name: 'test node', parentId: 1 },
      ];
    }

    throw new Error(`Unexpected node: ${node.name}`);
  },

  contentsAfterCreate: (node: CreateTreeNodeReqDTO): Record<number, ContentRespDto> => {
    if (node.name === 'test node') {
      return {
        1: { data: 'Content for root node' },
        2: { data: 'Content for child node' },
        3: { data: 'Content for child node 2' },
        4: { data: 'Content for grandchild node' },
        5: { data: 'test content' },
      };
    }

    throw new Error(`Unexpected node: ${node.name}`);
  },

  flatNodesAfterUpdate: (node: UpdateTreeNodeReqDTO): TreeNodeRespDTO[] => {
    if (node.name === 'changed node') {
      return [
        { id: 1, name: 'changed node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
      ];
    }

    throw new Error(`Unexpected node: ${node.name}`);
  },

  contentsAfterUpdate: (node: UpdateTreeNodeReqDTO): Record<number, ContentRespDto> => {
    if (node.name === 'changed node') {
      return {
        1: { data: 'changed content' },
        2: { data: 'Content for child node' },
        3: { data: 'Content for child node 2' },
        4: { data: 'Content for grandchild node' },
      };
    }

    throw new Error(`Unexpected node: ${node.name}`);
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

  foundNodes: (searchText: string): number[] => {
    if (searchText === 'Grand') {
      return [4];
    }

    throw new Error(`Unexpected search text: ${searchText}`);
  },
};
