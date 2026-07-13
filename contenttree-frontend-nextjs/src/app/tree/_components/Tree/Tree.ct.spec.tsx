import { beforeEach, describe, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import TreePage from "@/app/tree/page";
import { it } from "@/test-utils/msw-ct";
import { WithTreePageContextProvider } from "@/test-utils/tree-page-provider";

describe("Tree", () => {
  const rootNode = page.getByRole("treeitem", { name: "Root node", exact: true });
  const childNode1 = page.getByRole("treeitem", { name: "Child node", exact: true });
  const grandChildNode = page.getByRole("treeitem", { name: "Grandchild node", exact: true });
  const childNode2 = page.getByRole("treeitem", { name: "Child node 2", exact: true });

  beforeEach(async () => {
    await render(
      <WithTreePageContextProvider>
        <TreePage />
      </WithTreePageContextProvider>,
    );

    await expect.element(page.getByText("Loading...")).not.toBeInTheDocument();
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
          .elements(),
      ).toMatchObject([
        expect.toHaveTextContent("Root node"),
        expect.toHaveTextContent("Child node"),
        expect.toHaveTextContent("Grandchild node"),
        expect.toHaveTextContent("Child node 2"),
      ]);
    });

    it("can select and deselect node", async () => {
      await grandChildNode.click();

      await expect.element(grandChildNode).toHaveAttribute("aria-selected", "true");

      await grandChildNode.click();

      await expect.element(grandChildNode).not.toHaveAttribute("aria-selected", "true");
    });

    it("can collapse and expand a node", async () => {
      await page.getByRole("button", { name: `Toggle Child node`, exact: true }).click();

      await expect.element(childNode1).toHaveAttribute("aria-expanded", "false");
      await expect.element(grandChildNode).not.toBeInTheDocument();

      await page.getByRole("button", { name: `Toggle Child node`, exact: true }).click();

      await expect.element(childNode1).toHaveAttribute("aria-expanded", "true");
      await expect.element(grandChildNode).toBeVisible();
    });

    // TODO: Find out why this test fails.
    it.skip("can move nodes", async () => {
      await grandChildNode.dropTo(page.getByRole("treeitem", { name: "Root node", exact: true }));

      for (const node of [rootNode, childNode1, grandChildNode, childNode2]) {
        await expect.element(node).toBeVisible();
      }

      expect(
        page
          .getByRole("treeitem", {
            name: /^(Root node|Child node( 2)?|Grandchild node)$/,
            exact: true,
          })
          .elements(),
      ).toMatchObject([
        expect.toHaveTextContent("Root node"),
        expect.toHaveTextContent("Child node"),
        expect.toHaveTextContent("Child node 2"),
        expect.toHaveTextContent("Grandchild node"),
      ]);
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
