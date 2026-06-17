import { test } from '@playwright/test';
import { NodeEditDialogPage } from '../pages/node-edit-dialog-page.js';
import { TreePage } from '../pages/tree-page.js';

test('should move node to new parent', async ({ page }) => {
  const treePage = new TreePage(page);
  const nodeEditDialogPage = new NodeEditDialogPage(page);

  await treePage.goto();
  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node for drag and drop 1', 'content for drag and drop 1');
  await treePage.selectNodeAndExpectContent(
    'node for drag and drop 1',
    'content for drag and drop 1',
  );

  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node for drag and drop 2', 'content for drag and drop 2');
  await treePage.selectNodeAndExpectContent(
    'node for drag and drop 2',
    'content for drag and drop 2',
  );

  await treePage.openAddNodeDialog();
  await nodeEditDialogPage.addNode('node for drag and drop 3', 'content for drag and drop 3');
  await treePage.selectNodeAndExpectContent(
    'node for drag and drop 3',
    'content for drag and drop 3',
  );

  await treePage.moveLeafNodeAndExpectParentIsLeaf(
    'node for drag and drop 3',
    'node for drag and drop 1',
    'node for drag and drop 2',
  );
});
