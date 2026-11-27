import { sleep } from 'k6';
import { TreeApi } from '../api/tree-api.ts';

export const createNode = (treeApi: TreeApi, name: string, content: string, parentId: number) => {
  if (!treeApi.createNode({ name, content, parentId })) return;

  // Client reloads tree after write operation.
  const nodes = treeApi.getFlatNodes();
  if (!nodes) return;
  const node = nodes.find((n) => n.name == name)!;

  if (!treeApi.getContentForSelectedNode(node.id)) return;

  sleep(1);

  return node;
};
