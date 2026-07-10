import { test } from '@playwright/test';
import { NodeDeleteDialogPage } from '../pages/node-delete-dialog-page copy.js';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';
import { projectScoped } from '../utils/node-naming.js';

test('should delete existing node', async ({ page }, testInfo) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);
  const nodeDeleteDialogPage = new NodeDeleteDialogPage(page);

  const nodeToBeDeleted = projectScoped('node to be deleted', testInfo);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeToBeDeleted, 'content for node to be deleted');
  await treePage.selectNodeAndExpectContent(nodeToBeDeleted, 'content for node to be deleted');

  await treePage.openDeleteNodeDialog();
  await nodeDeleteDialogPage.deleteNode(nodeToBeDeleted);
  await treePage.expectNodeDoesNotExist(nodeToBeDeleted);
});
