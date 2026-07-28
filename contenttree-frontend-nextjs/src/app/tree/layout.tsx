import type { ReactNode } from "react";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";
import { AbortContextProvider } from "../_lib/AbortContext";
import { AuthGuard } from "../_lib/AuthGuard";

export default function TreePageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <AbortContextProvider>
        <TreePageContextProvider>{children}</TreePageContextProvider>
      </AbortContextProvider>
    </AuthGuard>
  );
}
