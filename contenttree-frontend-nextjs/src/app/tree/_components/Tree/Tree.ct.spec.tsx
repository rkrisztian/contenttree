import { beforeEach, describe, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { it } from "@/test-utils/msw-ct";
import { renderTreePage } from "@/test-utils/test-components";
import { t } from "@/test-utils/test-i18n";

describe("Tree", () => {
  const node = (name: string) => page.getByRole("treeitem", { name, exact: true });
  const toggleButton = (name: string) =>
    page.getByRole("button", {
      name: t("tree-page.tree.toggle-button-aria-label", { nodeName: name }),
      exact: true,
    });

  const rootNode = node("Root node");
  const childNode1 = node("Child node");
  const grandChildNode = node("Grandchild node");
  const childNode2 = node("Child node 2");

  beforeEach(async () => {
    await renderTreePage();

    await expect.element(page.getByText("Loading...")).not.toBeInTheDocument();
    await expect.element(page.getByText("Loading tree...")).not.toBeInTheDocument();
  });

  describe("basic behavior", () => {
    it("can display nodes", async () => {
      for (const node of [rootNode, childNode1, grandChildNode, childNode2]) {
        await expect.element(node).toBeVisible();
      }

      expect(
        page
          .getByRole("treeitem", {
            name: /^(Root node|Child node( 2)?|Grandchild node)$/,
            exact: true,
          })
          .elements()
          .map((element) => element.ariaLabel),
      ).toEqual(["Root node", "Child node", "Grandchild node", "Child node 2"]);
    });

    it("can select and deselect node", async () => {
      await grandChildNode.click();

      await expect.element(grandChildNode).toHaveAttribute("aria-selected", "true");

      await grandChildNode.click();

      await expect.element(grandChildNode).not.toHaveAttribute("aria-selected", "true");
    });

    it("can collapse and expand a node", async () => {
      await toggleButton("Child node").click();

      await expect.element(childNode1).toHaveAttribute("aria-expanded", "false");
      await expect.element(grandChildNode).not.toBeInTheDocument();

      await toggleButton("Child node").click();

      await expect.element(childNode1).toHaveAttribute("aria-expanded", "true");
      await expect.element(grandChildNode).toBeVisible();
    });

    it("can move nodes", async () => {
      await grandChildNode.dropTo(rootNode);

      await expect.element(toggleButton("Child node")).not.toBeInTheDocument();

      for (const node of [rootNode, childNode1, grandChildNode, childNode2]) {
        await expect.element(node).toBeVisible();
      }

      expect(
        page
          .getByRole("treeitem", {
            name: /^(Root node|Child node( 2)?|Grandchild node)$/,
            exact: true,
          })
          .elements()
          .map((element) => element.ariaLabel),
      ).toEqual(["Root node", "Child node", "Child node 2", "Grandchild node"]);
    });
  });

  describe("keyboard navigation", () => {
    it("should focus items with ArrowDown and ArrowUp keys", async () => {
      rootNode.element().focus();

      expect(rootNode).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");

      expect(childNode1).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");

      expect(rootNode).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");

      expect(childNode2).toHaveFocus();
    });

    it("should toggle selection with Enter key", async () => {
      rootNode.element().focus();

      expect(rootNode.element().getAttribute("aria-selected")).toBe("true");

      await userEvent.keyboard("{Enter}");

      expect(rootNode.element().getAttribute("aria-selected")).toBe("false");

      await userEvent.keyboard("{Enter}");

      expect(rootNode.element().getAttribute("aria-selected")).toBe("true");
    });

    it("should toggle expansion with Space key", async () => {
      rootNode.element().focus();

      expect(rootNode.element().getAttribute("aria-selected")).toBe("true");

      await userEvent.keyboard(" ");

      expect(rootNode).toHaveAttribute("aria-expanded", "false");

      await userEvent.keyboard(" ");

      expect(rootNode).toHaveAttribute("aria-expanded", "true");
    });
  });
});
