import { TreeApi } from '../api/tree-api';

export const setUpDb = (treeApi: TreeApi) => {
  return treeApi.createNode({
    name: 'Root node',
    content: 'Root content',
  });
};
