import { test as setup } from '@playwright/test';
import { components } from '../api/schema.js';

type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];

setup('add root node', async ({ request }) => {
  const createResponse = await request.put(`/api/tree`, {
    data: {
      name: 'Root node',
      content: 'Root content',
    } as CreateTreeNodeReqDTO,
  });

  if (!createResponse.ok()) {
    throw new Error(`Failed to create root node: ${await createResponse.text()}`);
  }
});
