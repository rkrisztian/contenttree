import { setupWorker, SetupWorker } from 'msw/browser';
import { it as itBase } from 'vitest';
import { handlers, resetMswMocks } from './msw-mocks';

const worker = setupWorker(...handlers);

export const it = itBase.extend<{
  $test: { worker: SetupWorker };
}>({
  worker: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(worker);
      worker.resetHandlers();
      resetMswMocks();
    },
    {
      auto: true,
    },
  ],
});

it.beforeAll(async () => {
  await worker.start({ quiet: true });
});
