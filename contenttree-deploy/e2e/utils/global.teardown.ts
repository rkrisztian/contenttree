import { test as teardown } from '@playwright/test';
import { components } from '../api/schema.js';
import { login } from './auth-api.js';
import { ADMIN_PASSWORD } from './constants.js';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];

const apiUrl = '/api/tree';

teardown('delete all nodes', async ({ request }) => {
  const headers = await login(request, 'admin', ADMIN_PASSWORD);
  const listResponse = await request.get(apiUrl, { headers });

  if (!listResponse.ok()) {
    throw new Error(`Failed to list nodes: ${await listResponse.text()}`);
  }

  const nodes = (await listResponse.json()) as TreeNodeRespDTO[];
  const rootNode = nodes.find((node) => node.parentId == null);

  if (rootNode) {
    const deleteResponse = await request.delete(`${apiUrl}/${rootNode.id}`, { headers });

    if (!deleteResponse.ok()) {
      throw new Error(`Failed to delete root node: ${await deleteResponse.text()}`);
    }
  }
});
