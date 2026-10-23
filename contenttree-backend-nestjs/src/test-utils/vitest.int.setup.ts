import {
  destroyTestApp,
  resetTestDatabase,
  startTestDatabase,
  stopTestDatabase,
} from './test-postgres.js';

beforeAll(async () => {
  await startTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase();
});

afterEach(async () => {
  await resetTestDatabase();
  await destroyTestApp();
});
