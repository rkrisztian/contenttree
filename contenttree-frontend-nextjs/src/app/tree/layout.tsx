import type { ReactNode } from "react";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";
import { AuthGuard } from "../_lib/AuthGuard";

export default function TreePageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <TreePageContextProvider>{children}</TreePageContextProvider>
    </AuthGuard>
  );
}
