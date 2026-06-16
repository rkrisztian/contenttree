import { expect, test } from '@playwright/test';

test('should delete existing node', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node to be deleted');
  await dialog.getByRole('textbox', { name: 'Content', exact: true }).fill('dummy content');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page.getByRole('button', { name: 'node to be deleted', exact: true }).click();
  await page.getByRole('button', { name: 'Delete selected node', exact: true }).click();

  await expect(dialog).toContainText('node to be deleted');

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(dialog).not.toBeInViewport();
  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'node to be deleted', exact: true }),
  ).not.toBeInViewport();
});
