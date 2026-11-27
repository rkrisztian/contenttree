import { sleep } from 'k6';
import { TreeNodeRespDTO } from '../../../api/schema';
import { createNode } from '../actions/create-node.ts';
import { loadTree } from '../actions/load-tree.ts';
import { TreeApi } from '../api/tree-api.ts';
import { getRootNode, unique } from '../tree-util.ts';

export const moveNode = (token: string) => {
  const treeApi = new TreeApi(token);
  let node1: TreeNodeRespDTO | undefined;

  try {
    const treeApi = new TreeApi(token);
    const nodeName1 = unique('node for drag and drop 1');
    const nodeName2 = unique('node for drag and drop 2');
    const nodeName3 = unique('node for drag and drop 3');

    const nodes = loadTree(treeApi);
    if (!nodes) return;

    node1 = createNode(treeApi, nodeName1, 'content for drag and drop 1', getRootNode(nodes).id);
    if (!node1) return;

    const node2 = createNode(treeApi, nodeName2, 'content for drag and drop 2', node1.id);
    if (!node2) return;

    const node3 = createNode(treeApi, nodeName3, 'content for drag and drop 3', node2.id);
    if (!node3) return;

    if (!treeApi.moveNode(node3.id, node1.id)) return;

    // Client reloads the tree after write.
    const loadRes = treeApi.getFlatNodes();
    sleep(1);
    return loadRes;
  } finally {
    if (node1) treeApi.deleteNode(node1.id);
  }
};
