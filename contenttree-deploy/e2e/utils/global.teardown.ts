import { test as teardown } from '@playwright/test';
import { login } from '../api/auth-api.js';
import { deleteNode, listNodes } from '../api/tree-api.js';
import { ADMIN_PASSWORD } from './constants.js';

const apiUrl = '/api/tree';

teardown('delete all nodes', async ({ request }) => {
  const headers = await login(request, 'admin', ADMIN_PASSWORD);
  const nodes = await listNodes(request, headers);
  const rootNode = nodes.find((node) => node.parentId == null);

  if (rootNode) {
    await deleteNode(request, headers, rootNode.id);
  }
});
