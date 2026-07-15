import { SetupServer, setupServer } from 'msw/node';
import { it as itBase } from 'vitest';
import { handlers, resetMswMocks } from './msw-mocks';

const server = setupServer(...handlers);

export const it = itBase.extend<{
  $test: { server: SetupServer };
}>({
  server: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      // TODO: When isolation is disabled, `it.beforeAll` only runs once per worker instead of
      //       per test file.
      server.listen();
      await use(server);
      server.resetHandlers();
      resetMswMocks();
      server.close();
    },
    {
      auto: true,
    },
  ],
});
