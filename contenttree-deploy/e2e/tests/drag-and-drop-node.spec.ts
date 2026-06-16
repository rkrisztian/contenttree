import { expect, test } from '@playwright/test';

test('should move node to new parent', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 1');
  await dialog
    .getByRole('textbox', { name: 'Content', exact: true })
    .fill('content for drag and drop 1');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();
  await page.getByRole('button', { name: 'node for drag and drop 1', exact: true }).click();

  await expect(page.getByText('content for drag and drop 1', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Add new node', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 2');
  await dialog
    .getByRole('textbox', { name: 'Content', exact: true })
    .fill('content for drag and drop 2');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();
  await page.getByRole('button', { name: 'node for drag and drop 2', exact: true }).click();

  await expect(page.getByText('content for drag and drop 2', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Add new node', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node for drag and drop 3');
  await dialog
    .getByRole('textbox', { name: 'Content', exact: true })
    .fill('content for drag and drop 3');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();
  await page.getByRole('button', { name: 'node for drag and drop 3', exact: true }).click();

  await expect(page.getByText('content for drag and drop 3', { exact: true })).toBeVisible();

  await page
    .getByRole('button', { name: 'node for drag and drop 3', exact: true })
    .dragTo(page.getByRole('button', { name: 'node for drag and drop 1', exact: true }));

  await expect(
    page.getByRole('button', { name: 'Toggle node for drag and drop 2' }),
  ).not.toBeInViewport();
});
