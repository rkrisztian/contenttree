import { test as teardown } from '@playwright/test';
import { components } from '../api/schema.js';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];

const apiUrl = '/api/tree';

teardown('clean up database', async ({ request }) => {
  const listResponse = await request.get(apiUrl);

  if (!listResponse.ok()) {
    throw new Error(`Failed to list nodes: ${await listResponse.text()}`);
  }

  const nodes = (await listResponse.json()) as TreeNodeRespDTO[];
  const rootNode = nodes.find((node) => node.parentId == null);

  if (rootNode) {
    const deleteResponse = await request.delete(`${apiUrl}/${rootNode.id}`);

    if (!deleteResponse.ok()) {
      throw new Error(`Failed to delete root node: ${await deleteResponse.text()}`);
    }
  }
});
