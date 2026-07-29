import type { ReactNode } from "react";
import { AbortContextProvider } from "@/app/_lib/AbortContext";
import { AuthGuard } from "@/app/_lib/AuthGuard";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";

export default function TreePageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <AbortContextProvider>
        <TreePageContextProvider>{children}</TreePageContextProvider>
      </AbortContextProvider>
    </AuthGuard>
  );
}
