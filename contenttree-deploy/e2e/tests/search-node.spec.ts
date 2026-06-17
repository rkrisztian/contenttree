import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';

test('should find matching node', async ({ page }) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node to be searched', 'search text');

  await treePage.searchAndExpectMatch('search text', 'node to be searched');
  await treePage.clearSearchAndExpectNoMatch('node to be searched');
});
