import { sleep } from 'k6';
import { TreeApi } from '../api/tree-api.ts';
import { getRootNode } from '../tree-util.ts';

/**
 * For simulating initial load in the client.
 */
export const loadTree = (treeApi: TreeApi) => {
  let nodes = treeApi.getFlatNodes();
  if (!nodes) return;

  if (nodes.length) {
    if (!treeApi.getContentForSelectedNode(getRootNode(nodes).id)) return;
  }

  sleep(1);

  return nodes;
};
