import { test } from '@playwright/test';
import { NodeDeleteDialogPage } from '../pages/node-delete-dialog-page copy.js';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';

test('should delete existing node', async ({ page }) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);
  const nodeDeleteDialogPage = new NodeDeleteDialogPage(page);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node to be deleted', 'content for node to be deleted');
  await treePage.selectNodeAndExpectContent('node to be deleted', 'content for node to be deleted');

  await treePage.openDeleteNodeDialog();
  await nodeDeleteDialogPage.deleteNode('node to be deleted');
  await treePage.expectNodeDoesNotExist('node to be deleted');
});
