import { afterAll, vi } from 'vitest';

afterAll(() => {
  // Prevent module state pollution
  vi.resetModules();
});
