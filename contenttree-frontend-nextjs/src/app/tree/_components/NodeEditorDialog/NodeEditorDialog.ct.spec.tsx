import { beforeEach, describe, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import TreePage from "@/app/tree/page";
import { it } from "@/test-utils/msw-ct";
import { WithTreePageContextProvider } from "@/test-utils/tree-page-provider";

describe("NodeEditorDialog", () => {
  beforeEach(async () => {
    await render(
      <WithTreePageContextProvider>
        <TreePage />
      </WithTreePageContextProvider>,
    );
  });

  it("can add new node", async () => {
    await page.getByRole("button", { name: "Add new node", exact: true }).click();

    const dialog = page.getByRole("dialog");

    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole("button", { name: "Add Node", exact: true }))
      .toBeDisabled();

    await userEvent.fill(dialog.getByPlaceholder("Enter node name"), "test node");
    await userEvent.fill(dialog.getByPlaceholder("Enter node content"), "test content");

    await expect
      .element(dialog.getByRole("button", { name: "Add Node", exact: true }))
      .toBeEnabled();

    await dialog.getByRole("button", { name: "Add Node", exact: true }).click();

    await expect.element(dialog).not.toBeInTheDocument();

    await expect
      .element(page.getByRole("treeitem", { name: "test node", exact: true }))
      .toBeVisible();

    await page.getByRole("treeitem", { name: "test node", exact: true }).click();

    await expect.element(page.getByText("test content", { exact: true })).toBeVisible();
  });

  it("it does not allow adding node with validation errors", async () => {
    await page.getByRole("button", { name: "Add new node", exact: true }).click();

    const dialog = page.getByRole("dialog");

    await expect
      .element(dialog.getByRole("button", { name: "Add Node", exact: true }))
      .toBeInTheDocument();

    await userEvent.fill(dialog.getByPlaceholder("Enter node name"), "test node");
    await userEvent.fill(dialog.getByPlaceholder("Enter node content"), "test content");

    await expect
      .element(dialog.getByRole("button", { name: "Add Node", exact: true }))
      .toBeEnabled();

    await userEvent.clear(dialog.getByPlaceholder("Enter node name"));
    await userEvent.clear(dialog.getByPlaceholder("Enter node content"));

    await expect.element(dialog.getByPlaceholder("Enter node name")).toBeInvalid();
    await expect.element(dialog.getByPlaceholder("Enter node name")).toBeInvalid();
    await expect.element(dialog.getByText("Node name is required")).toBeVisible();
    await expect.element(dialog.getByText("Node content is required")).toBeVisible();
    await expect
      .element(dialog.getByRole("button", { name: "Add Node", exact: true }))
      .toBeDisabled();
  });

  it("can edit existing node", async () => {
    await page.getByRole("button", { name: "Edit selected node", exact: true }).click();

    const dialog = page.getByRole("dialog");

    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole("button", { name: "Edit Node", exact: true }))
      .toBeEnabled();

    await userEvent.fill(dialog.getByPlaceholder("Enter node name"), "changed node");
    await userEvent.fill(dialog.getByPlaceholder("Enter node content"), "changed content");

    await expect
      .element(dialog.getByRole("button", { name: "Edit Node", exact: true }))
      .toBeEnabled();

    await dialog.getByRole("button", { name: "Edit Node", exact: true }).click();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect
      .element(page.getByRole("treeitem", { name: "changed node", exact: true }))
      .toBeVisible();

    await expect.element(page.getByText("changed content", { exact: true })).toBeVisible();
  });
});
