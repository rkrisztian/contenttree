import { TreeApi } from '../api/tree-api';
import { getRootNode } from '../tree-util.ts';

export const cleanUpDb = (treeApi: TreeApi) => {
  const nodes = treeApi.getFlatNodes();
  if (!nodes) return;

  const rootNode = getRootNode(nodes);

  return rootNode ? treeApi.deleteNode(rootNode.id) : true;
};
