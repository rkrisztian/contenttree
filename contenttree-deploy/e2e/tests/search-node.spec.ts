import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';
import { projectScoped } from '../utils/node-naming.js';

test('should find matching node', async ({ page }, testInfo) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  const nodeToBeSearched = projectScoped('node to be searched', testInfo);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeToBeSearched, 'search text');

  await treePage.searchAndExpectMatch('search text', nodeToBeSearched);
  await treePage.clearSearchAndExpectNoMatch(nodeToBeSearched);
});
