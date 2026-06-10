import { SetupWorker } from 'msw/browser';
import { it as itBase } from 'vitest';
import { worker } from './msw-mocks';

export const it = itBase.extend<{
  $test: { worker: SetupWorker };
}>({
  worker: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(worker);
      worker.resetHandlers();
    },
    {
      auto: true,
    },
  ],
});

it.beforeAll(async () => {
  await worker.start({ quiet: true });
});
