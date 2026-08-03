import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { vi } from "vitest";

export const mockRouter: Partial<AppRouterInstance> = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export const useRouter = () => {
  return mockRouter;
};

export const useParams = vi.fn();
