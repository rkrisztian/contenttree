import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';
import { projectScoped } from '../utils/naming.js';

test('should edit existing node', async ({ page }, testInfo) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  const nodeToBeEdited = projectScoped('node to be edited', testInfo);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeToBeEdited, 'content for node to be edited');
  await treePage.selectNodeAndExpectContent(nodeToBeEdited, 'content for node to be edited');

  await treePage.openEditNodeDialog();
  await nodeEditDialogPage.editNode(
    `${nodeToBeEdited} - changed`,
    'content for node to be edited - changed',
  );
  await treePage.expectSelectedNodeAndContentExists(
    `${nodeToBeEdited} - changed`,
    'content for node to be edited - changed',
  );
});
