import { expect, test } from '@playwright/test';

test('should edit existing node', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new node', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('node to be edited');
  await dialog
    .getByRole('textbox', { name: 'Content', exact: true })
    .fill('content for node to be edited');
  await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();

  await page.getByRole('button', { name: 'node to be edited', exact: true }).click();

  await expect(page.getByText('content for node to be edited', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Edit selected node', exact: true }).click();

  await dialog
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('node to be edited - changed');
  await dialog
    .getByRole('textbox', { name: 'Content', exact: true })
    .fill('content for node to be edited - changed');
  await dialog.getByRole('button', { name: 'Edit Node', exact: true }).click();

  await expect(page.getByText('Loading tree...', { exact: true })).not.toBeInViewport();
  await expect(page.getByText('Loading content...', { exact: true })).not.toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'node to be edited - changed', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('content for node to be edited - changed', { exact: true }),
  ).toBeVisible();
});
