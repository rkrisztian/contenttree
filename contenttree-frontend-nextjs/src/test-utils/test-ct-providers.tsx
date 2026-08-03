import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type React from "react";
import { mockRouter } from "./mock-next-navigation";

/** `test.alias` alone is not enough to mock the router */
export const WithMockAppRouterContextProvider = ({
  router,
  children,
}: {
  router?: Partial<AppRouterInstance>;
  children: React.ReactNode;
}): React.ReactNode => {
  return (
    <AppRouterContext.Provider
      value={
        {
          ...mockRouter,
          ...router,
        } as AppRouterInstance
      }
    >
      {children}
    </AppRouterContext.Provider>
  );
};
