import { SetupServer, setupServer } from 'msw/node';
import { it as itBase } from 'vitest';
import { handlers } from './msw-mocks';

const server = setupServer(...handlers);

export const it = itBase.extend<{
  $test: { server: SetupServer };
}>({
  server: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(server);
      server.resetHandlers();
    },
    {
      auto: true,
    },
  ],
});

it.beforeAll(() => {
  server.listen();
});

it.afterAll(() => {
  server.close();
});
