import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import TreePage from "@/app/tree/page";
import { it } from "@/test-utils/msw-ct";
import { WithTreePageContextProvider } from "@/test-utils/test-providers";

describe("TreeToolbar", () => {
  beforeEach(async () => {
    await render(
      <WithTreePageContextProvider>
        <TreePage />
      </WithTreePageContextProvider>,
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not allow adding/editing/deleting if no node is selected", async () => {
    await page.getByRole("treeitem", { name: "Root node", exact: true }).click();

    for (const name of ["Add new node", "Edit selected node", "Delete selected node"]) {
      await expect.element(page.getByRole("button", { name, exact: true })).toBeDisabled();
    }
  });

  it("does not allow deleting the root node", async () => {
    await expect
      .element(page.getByRole("button", { name: "Delete selected node", exact: true }))
      .toBeDisabled();
  });

  describe("Search field", () => {
    const searchField = page.getByRole("searchbox", { name: "Search nodes" });

    it("can search for nodes", async () => {
      await userEvent.fill(searchField, "Grand");
      await vi.runAllTimersAsync();

      await expect.element(searchField).toBeValid();
      await expect
        .element(page.getByRole("treeitem", { name: "Grandchild node matched", exact: true }))
        .toBeVisible();

      for (const name of ["Root node", "Child node", "Child node 2"]) {
        await expect.element(page.getByRole("treeitem", { name, exact: true })).toBeVisible();
      }
    });

    it("will not start a search under 3 characters", async () => {
      await userEvent.fill(searchField, "Gr");
      await userEvent.tab();
      await vi.runAllTimersAsync();

      await expect.element(searchField).toBeInvalid();
      await expect.element(page.getByText("At least 3 characters are required")).toBeVisible();
    });

    it("can clear search", async () => {
      await userEvent.fill(searchField, "Grand");
      await vi.runAllTimersAsync();

      await expect
        .element(page.getByRole("treeitem", { name: "Grandchild node matched", exact: true }))
        .toBeVisible();

      await page.getByRole("button", { name: "Clear search", exact: true }).click();
      await vi.runAllTimersAsync();

      await expect.element(searchField).toBeValid();
      await expect
        .element(page.getByRole("treeitem", { name: "Grandchild node matched", exact: true }))
        .not.toBeInTheDocument();
    });
  });
});
