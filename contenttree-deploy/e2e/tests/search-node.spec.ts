import { expect, test } from '@playwright/test';

test('should find matching node', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node to be searched');
  await dialog.getByRole('textbox', { name: 'Content', exact: true }).fill('search text');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search nodes', exact: true }).fill('search text');

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'node to be searched matched', exact: true }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Clear search', exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'node to be searched', exact: true }),
  ).toBeVisible();
});
