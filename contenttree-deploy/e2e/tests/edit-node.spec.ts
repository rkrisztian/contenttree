import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';

test('should edit existing node', async ({ page }) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node to be edited', 'content for node to be edited');
  await treePage.selectNodeAndExpectContent('node to be edited', 'content for node to be edited');

  await treePage.openEditNodeDialog();
  await nodeEditDialogPage.editNode(
    'node to be edited - changed',
    'content for node to be edited - changed',
  );
  await treePage.expectSelectedNodeAndContentExists(
    'node to be edited - changed',
    'content for node to be edited - changed',
  );
});
