import { sleep } from 'k6';
import { createNode } from '../actions/create-node.ts';
import { loadTree } from '../actions/load-tree.ts';
import { TreeApi } from '../api/tree-api.ts';
import { getRootNode, unique } from '../tree-util.ts';

export const deleteNode = (token: string) => {
  const treeApi = new TreeApi(token);

  const nodes = loadTree(treeApi);
  if (!nodes) return;

  const node = createNode(
    treeApi,
    unique('node to be deleted'),
    'content for node to be deleted',
    getRootNode(nodes).id,
  );
  if (!node) return;

  if (!treeApi.deleteNode(node.id)) return;

  // Client reloads the tree after write.
  const loadRes = treeApi.getFlatNodes();
  sleep(1);

  return loadRes;
};
