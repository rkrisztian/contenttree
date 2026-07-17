import { render } from "vitest-browser-react/pure";
import TreePage from "@/app/tree/page";
import { WithTreePageContextProvider } from "./test-providers";

export const renderTreePage = async () =>
  await render(
    <WithTreePageContextProvider>
      <TreePage />
    </WithTreePageContextProvider>,
  );
