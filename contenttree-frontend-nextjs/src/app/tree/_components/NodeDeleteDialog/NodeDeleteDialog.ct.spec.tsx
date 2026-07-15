import { beforeEach, describe, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import TreePage from "@/app/tree/page";
import { it } from "@/test-utils/msw-ct";
import { WithTreePageContextProvider } from "@/test-utils/tree-page-provider";

describe("NodeDeleteDialog", () => {
  beforeEach(async () => {
    await render(
      <WithTreePageContextProvider>
        <TreePage />
      </WithTreePageContextProvider>,
    );
  });

  it("can delete existing node", async () => {
    await page.getByRole("treeitem", { name: "Child node", exact: true }).click();
    await page.getByRole("button", { name: "Delete selected node", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeVisible();
    for (const name of ["Child node", "Grandchild node"]) {
      await expect
        .element(dialog.getByRole("listitem").getByText(name, { exact: true }))
        .toBeVisible();
    }
    await dialog.getByRole("button", { name: "Delete All", exact: true }).click();
    await expect.element(dialog).not.toBeInTheDocument();
    for (const name of ["Root node", "Child node 2"]) {
      await expect.element(page.getByRole("treeitem", { name, exact: true })).toBeVisible();
    }
    for (const name of ["Child node", "Grandchild node"]) {
      await expect
        .element(page.getByRole("treeitem", { name, exact: true }))
        .not.toBeInTheDocument();
    }
  });
});
