import type { ReactNode } from "react";
import { TreePageContextProvider } from "@/app/tree/_lib/TreePageContext";

export default function TreePageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <TreePageContextProvider>{children}</TreePageContextProvider>;
}
