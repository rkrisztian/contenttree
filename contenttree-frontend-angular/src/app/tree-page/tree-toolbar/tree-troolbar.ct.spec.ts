import { it } from '@/test-utils/msw-ct';
import { renderTreePage } from '@/test-utils/test-configurations';
import { t } from '@/test-utils/test-i18n';
import { page, userEvent } from 'vitest/browser';

describe('TreeToolbar', () => {
  beforeEach(async () => {
    await renderTreePage();

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Add/Edit/Delete buttons', () => {
    const addNewNodeButton = () =>
      page.getByRole('button', {
        name: t('tree-page.toolbar.add-new-node-button-aria-label'),
        exact: true,
      });
    const editSelectedNodeButton = () =>
      page.getByRole('button', {
        name: t('tree-page.toolbar.edit-selected-node-button-aria-label'),
        exact: true,
      });
    const deleteSelectedNodeButton = () =>
      page.getByRole('button', {
        name: t('tree-page.toolbar.delete-selected-node-button-aria-label'),
        exact: true,
      });

    it('does not allow deleting the root node', async () => {
      await expect.element(deleteSelectedNodeButton()).toBeDisabled();
    });

    it('does not allow adding/editing/deleting if no node is selected', async () => {
      await page.getByRole('treeitem', { name: 'Root node', exact: true }).click();

      for (const button of [
        addNewNodeButton(),
        editSelectedNodeButton(),
        deleteSelectedNodeButton(),
      ]) {
        await expect.element(button).toBeDisabled();
      }
    });
  });

  describe('Search field', () => {
    const searchField = () =>
      page.getByRole('searchbox', { name: t('tree-page.toolbar.search-field-label') });
    const matchedNode = (nodeName: string) =>
      page.getByRole('treeitem', {
        name: t('tree-page.tree.node-matched-aria-label', { nodeName }),
        exact: true,
      });
    const threeCharsRequired = () =>
      page.getByText(t('tree-page.toolbar.search-field-3-chars-required'));
    const clearSearchButton = () =>
      page.getByRole('button', {
        name: t('tree-page.toolbar.search-field-clear-button-aria-label'),
        exact: true,
      });

    it('can search for nodes', async () => {
      await userEvent.fill(searchField(), 'Grand');
      await vi.runAllTimersAsync();

      await expect.element(searchField()).toBeValid();
      await expect.element(matchedNode('Grandchild node')).toBeVisible();

      for (const name of ['Root node', 'Child node', 'Child node 2']) {
        await expect.element(page.getByRole('treeitem', { name, exact: true })).toBeVisible();
      }
    });

    it('will not start a search under 3 characters', async () => {
      await userEvent.fill(searchField(), 'Gr');
      await userEvent.tab();
      await vi.runAllTimersAsync();

      await expect.element(searchField()).toBeInvalid();
      await expect.element(threeCharsRequired()).toBeVisible();
    });

    it('can clear search', async () => {
      await userEvent.fill(searchField(), 'Grand');
      await vi.runAllTimersAsync();

      await expect.element(matchedNode('Grandchild node')).toBeVisible();

      await clearSearchButton().click();
      await vi.runAllTimersAsync();

      await expect.element(searchField()).toBeValid();
      await expect.element(matchedNode('Grandchild node')).not.toBeInTheDocument();
    });
  });
});
