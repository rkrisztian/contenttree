import { type SetupWorker, setupWorker } from "msw/browser";
import { it as itBase } from "vitest";
import { handlers, resetMswMocks } from "./msw-mocks";

const worker = setupWorker(...handlers);

export const it = itBase.extend<{
  $test: { worker: SetupWorker };
}>({
  worker: [
    // biome-ignore lint/correctness/noEmptyPattern: official pattern
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
