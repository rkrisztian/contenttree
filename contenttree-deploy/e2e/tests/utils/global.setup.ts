import { test as setup } from '@playwright/test';
import { components } from './schema.js';

type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];

setup('initialize database', async ({ request }) => {
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
