import { expect, test } from '@playwright/test';

test('should move node to new parent', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 1');
  await dialog.getByRole('textbox', { name: 'Content', exact: true }).fill('dummy content 1');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page.getByRole('button', { name: 'node for drag and drop 1', exact: true }).click();
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 2');
  await dialog.getByRole('textbox', { name: 'Content', exact: true }).fill('dummy content 2');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page.getByRole('button', { name: 'node for drag and drop 2', exact: true }).click();
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 3');
  await dialog.getByRole('textbox', { name: 'Content', exact: true }).fill('dummy content 3');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page
    .getByRole('button', { name: 'node for drag and drop 3', exact: true })
    .dragTo(page.getByRole('button', { name: 'node for drag and drop 1', exact: true }));

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page
    .getByRole('button', { name: 'node for drag and drop 2', exact: true })
    .dragTo(page.getByRole('button', { name: 'node for drag and drop 3', exact: true }));

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();
  expect(
    (
      await page
        .getByRole('button', { name: /^node for drag and drop \d$/, exact: true })
        .allTextContents()
    ).map((text) => text.replace(/^\s*(folder|insert_drive_file)\s*/, '')),
  ).toEqual(['node for drag and drop 1', 'node for drag and drop 3', 'node for drag and drop 2']);
});
