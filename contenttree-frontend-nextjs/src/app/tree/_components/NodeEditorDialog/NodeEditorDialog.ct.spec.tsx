import { beforeEach, describe, expect } from "vitest";
import { type Locator, page, userEvent } from "vitest/browser";
import { it } from "@/test-utils/msw-ct";
import { renderTreePage } from "@/test-utils/test-components";
import { t } from "@/test-utils/test-i18n";

describe("NodeEditorDialog", () => {
  const node = (name: string) => page.getByRole("treeitem", { name, exact: true });
  const addNewNodeButton = () =>
    page.getByRole("button", {
      name: t("tree-page.toolbar.add-new-node-button-aria-label"),
      exact: true,
    });
  const editSelectedNodeButton = () =>
    page.getByRole("button", {
      name: t("tree-page.toolbar.edit-selected-node-button-aria-label"),
      exact: true,
    });
  const addNodeButton = (dialog: Locator) =>
    dialog.getByRole("button", {
      name: t("tree-page.node-editor-dialog.add-button-label"),
      exact: true,
    });
  const editNodeButton = (dialog: Locator) =>
    dialog.getByRole("button", {
      name: t("tree-page.node-editor-dialog.edit-button-label"),
      exact: true,
    });
  const nodeNameField = (dialog: Locator) =>
    dialog.getByPlaceholder(t("tree-page.node-editor-dialog.node-name-field-placeholder"));
  const nodeNameRequired = (dialog: Locator) =>
    dialog.getByText(t("tree-page.node-editor-dialog.node-name-field-required"));
  const nodeContentField = (dialog: Locator) =>
    dialog.getByPlaceholder(t("tree-page.node-editor-dialog.node-content-field-placeholder"));
  const nodeContentRequired = (dialog: Locator) =>
    dialog.getByText(t("tree-page.node-editor-dialog.node-content-field-required"));

  beforeEach(async () => {
    await renderTreePage();
  });

  it("can add new node", async () => {
    await addNewNodeButton().click();

    const dialog = page.getByRole("dialog");

    await expect.element(dialog).toBeVisible();
    await expect.element(addNodeButton(dialog)).toBeDisabled();

    await userEvent.fill(nodeNameField(dialog), "test node");
    await userEvent.fill(nodeContentField(dialog), "test content");

    await expect.element(addNodeButton(dialog)).toBeEnabled();

    await addNodeButton(dialog).click();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(node("test node")).toBeVisible();

    await node("test node").click();

    await expect.element(page.getByText("test content", { exact: true })).toBeVisible();
  });

  it("it does not allow adding node with validation errors", async () => {
    await addNewNodeButton().click();

    const dialog = page.getByRole("dialog");

    await expect.element(addNodeButton(dialog)).toBeInTheDocument();

    await userEvent.fill(nodeNameField(dialog), "test node");
    await userEvent.fill(nodeContentField(dialog), "test content");

    await expect.element(addNodeButton(dialog)).toBeEnabled();

    await userEvent.clear(nodeNameField(dialog));
    await userEvent.clear(nodeContentField(dialog));

    await expect.element(nodeNameField(dialog)).toBeInvalid();
    await expect.element(nodeContentField(dialog)).toBeInvalid();
    await expect.element(nodeNameRequired(dialog)).toBeVisible();
    await expect.element(nodeContentRequired(dialog)).toBeVisible();
    await expect.element(addNodeButton(dialog)).toBeDisabled();
  });

  it("can edit existing node", async () => {
    await editSelectedNodeButton().click();

    const dialog = page.getByRole("dialog");

    await expect.element(dialog).toBeVisible();
    await expect.element(editNodeButton(dialog)).toBeEnabled();

    await userEvent.fill(nodeNameField(dialog), "changed node");
    await userEvent.fill(nodeContentField(dialog), "changed content");

    await expect.element(editNodeButton(dialog)).toBeEnabled();

    await editNodeButton(dialog).click();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(node("changed node")).toBeVisible();
    await expect.element(page.getByText("changed content", { exact: true })).toBeVisible();
  });
});
