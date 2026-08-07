import type { NextRouter } from "next/router";
import { vi } from "vitest";

export const mockRouter: Partial<NextRouter> = {
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export const useRouter = () => mockRouter;

export const useParams = vi.fn();
