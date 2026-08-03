import { render } from "vitest-browser-react/pure";
import TreePage from "@/app/tree/page";
import treeMessages from "@/i18n/messages/en/tree.json";
import { WithTestI18nProvider } from "./test-i18n";
import { WithTreePageContextProvider } from "./test-providers";

export const renderTreePage = async () =>
  await render(
    <WithTestI18nProvider resources={{ en: { treelogin: treeMessages } }}>
      <WithTreePageContextProvider>
        <TreePage />
      </WithTreePageContextProvider>
    </WithTestI18nProvider>,
  );
