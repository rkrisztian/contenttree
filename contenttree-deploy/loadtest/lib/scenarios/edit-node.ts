import { sleep } from 'k6';
import { TreeNodeRespDTO } from '../../../api/schema';
import { createNode } from '../actions/create-node.ts';
import { loadTree } from '../actions/load-tree.ts';
import { TreeApi } from '../api/tree-api.ts';
import { getRootNode, unique } from '../tree-util.ts';

export const editNode = (token: string) => {
  const treeApi = new TreeApi(token);
  let node: TreeNodeRespDTO | undefined;

  try {
    const nodes = loadTree(treeApi);
    if (!nodes) return;

    node = createNode(
      treeApi,
      unique('node to be edited'),
      'content for node to be edited',
      getRootNode(nodes).id,
    );
    if (!node) return;

    if (
      !treeApi.updateNode({
        id: node.id,
        name: unique('node to be edited - changed'),
        content: 'content for node to be edited - changed',
      })
    )
      return;

    // Client reloads the tree after write.
    const loadRes = treeApi.getFlatNodes();
    sleep(1);
    return loadRes;
  } finally {
    if (node) treeApi.deleteNode(node.id);
  }
};
