import { test as setup } from '@playwright/test';
import { login } from '../api/auth-api.js';
import { createNode } from '../api/tree-api.js';
import { CreateTreeNodeReqDTO } from '../api/types/models/CreateTreeNodeReqDTO.js';
import { ADMIN_PASSWORD } from './constants.js';

setup('add root node', async ({ request }) => {
  const headers = await login(request, 'admin', ADMIN_PASSWORD);

  await createNode(request, headers, {
    name: 'Root node',
    content: 'Root content',
  } as CreateTreeNodeReqDTO);
});
