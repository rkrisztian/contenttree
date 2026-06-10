import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { it } from '../../../test-utils/msw-ct';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePage } from '../tree-page';
import { TreePageService } from '../tree-page.service';

describe('NodeDeleteDialog', () => {
  beforeEach(async () => {
    await render(TreePage, {
      providers: [TreePageService, TreeApiService],
    });
  });

  it('can delete existing node', async () => {
    await page.getByRole('button', { name: 'Child node', exact: true }).click();
    await page.getByRole('button', { name: 'Delete selected node', exact: true }).click();

    const dialog = page.getByRole('dialog');

    await expect.element(dialog).toBeVisible();
    for (const name of ['Child node', 'Grandchild node']) {
      await expect
        .element(dialog.getByRole('listitem').getByText(name, { exact: true }))
        .toBeVisible();
    }

    await dialog.getByRole('button', { name: 'Delete All', exact: true }).click();

    await expect.element(dialog).not.toBeInTheDocument();

    for (const name of ['Root node', 'Child node 2']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
    for (const name of ['Child node', 'Grandchild node']) {
      await expect.element(page.getByRole('button', { name, exact: true })).not.toBeInTheDocument();
    }
  });
});
