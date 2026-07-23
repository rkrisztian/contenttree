import { test as setup } from '@playwright/test';
import { components } from '../api/schema.js';
import { login } from './auth-api.js';
import { ADMIN_PASSWORD } from './constants.js';

type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];

setup('add root node', async ({ request }) => {
  const headers = await login(request, 'admin', ADMIN_PASSWORD);
  const createResponse = await request.put(`/api/tree`, {
    headers,
    data: {
      name: 'Root node',
      content: 'Root content',
    } as CreateTreeNodeReqDTO,
  });

  if (!createResponse.ok()) {
    throw new Error(`Failed to create root node: ${await createResponse.text()}`);
  }
});
