import { sleep } from 'k6';
import { TreeNodeRespDTO } from '../../../api/schema';
import { createNode } from '../actions/create-node.ts';
import { loadTree } from '../actions/load-tree.ts';
import { TreeApi } from '../api/tree-api.ts';
import { getRootNode, unique } from '../tree-util.ts';

export const searchNode = (token: string) => {
  const treeApi = new TreeApi(token);
  let node: TreeNodeRespDTO | undefined;

  try {
    const treeApi = new TreeApi(token);

    const nodes = loadTree(treeApi);
    if (!nodes) return;

    node = createNode(treeApi, unique('node to be searched'), 'search text', getRootNode(nodes).id);
    if (!node) return;

    const foundNodes = treeApi.getFoundNodes('search text');
    sleep(1);
    if (!foundNodes) return;
  } finally {
    if (node) treeApi.deleteNode(node.id);
  }
};
