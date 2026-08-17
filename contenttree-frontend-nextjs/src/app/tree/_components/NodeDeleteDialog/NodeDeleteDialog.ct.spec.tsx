import { beforeEach, describe, expect } from "vitest";
import { type Locator, page } from "vitest/browser";
import { it } from "@/test-utils/msw-ct";
import { renderTreePage } from "@/test-utils/test-components";
import { t } from "@/test-utils/test-i18n";

describe("NodeDeleteDialog", () => {
  const node = (name: string) => page.getByRole("treeitem", { name, exact: true });
  const deleteSelectedNodeButton = page.getByRole("button", {
    name: "Delete selected node",
    exact: true,
  });
  const dialogNode = (dialog: Locator, name: string) =>
    dialog.getByRole("listitem").getByText(name, { exact: true });
  const dialogDeleteButton = (dialog: Locator, count: number) =>
    dialog.getByRole("button", {
      name: t("tree-page.node-delete-dialog.delete-button-label", { count }),
      exact: true,
    });

  beforeEach(async () => {
    await renderTreePage();
  });

  it("can delete existing node", async () => {
    await node("Child node").click();
    await deleteSelectedNodeButton.click();

    const dialog = page.getByRole("dialog");

    await expect.element(dialog).toBeVisible();
    for (const name of ["Child node", "Grandchild node"]) {
      await expect.element(dialogNode(dialog, name)).toBeVisible();
    }

    await dialogDeleteButton(dialog, 2).click();

    await expect.element(dialog).not.toBeInTheDocument();
    for (const name of ["Root node", "Child node 2"]) {
      await expect.element(node(name)).toBeVisible();
    }
    for (const name of ["Child node", "Grandchild node"]) {
      await expect.element(node(name)).not.toBeInTheDocument();
    }
  });
});
