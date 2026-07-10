import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';
import { projectScoped } from '../utils/node-naming.js';

test('should move node to new parent', async ({ page }, testInfo) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  const nodeForDragAndDrop1 = projectScoped('node for drag and drop 1', testInfo);
  const nodeForDragAndDrop2 = projectScoped('node for drag and drop 2', testInfo);
  const nodeForDragAndDrop3 = projectScoped('node for drag and drop 3', testInfo);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeForDragAndDrop1, 'content for drag and drop 1');
  await treePage.selectNodeAndExpectContent(nodeForDragAndDrop1, 'content for drag and drop 1');

  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeForDragAndDrop2, 'content for drag and drop 2');
  await treePage.selectNodeAndExpectContent(nodeForDragAndDrop2, 'content for drag and drop 2');

  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode(nodeForDragAndDrop3, 'content for drag and drop 3');
  await treePage.selectNodeAndExpectContent(nodeForDragAndDrop3, 'content for drag and drop 3');

  await treePage.moveLeafNodeAndExpectParentIsLeaf(
    nodeForDragAndDrop3,
    nodeForDragAndDrop1,
    nodeForDragAndDrop2,
  );
});
