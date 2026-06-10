import { render } from 'vitest-browser-angular';
import { page, userEvent } from 'vitest/browser';
import { it } from '../../../test-utils/msw-test';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePage } from '../tree-page';
import { TreePageService } from '../tree-page.service';

describe('NodeEditorDialog', () => {
  beforeEach(async () => {
    await render(TreePage, {
      providers: [TreePageService, TreeApiService],
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('can add new node', async () => {
    await page.getByRole('button', { name: 'Add new node', exact: true }).click();

    const dialog = page.getByRole('dialog');

    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('button', { name: 'Add Node', exact: true }))
      .toBeDisabled();

    await userEvent.fill(dialog.getByPlaceholder('Enter node name'), 'test node');
    await userEvent.fill(dialog.getByPlaceholder('Enter node content'), 'test content');
    await vi.runAllTimersAsync();

    await expect
      .element(dialog.getByRole('button', { name: 'Add Node', exact: true }))
      .toBeEnabled();

    await dialog.getByRole('button', { name: 'Add Node', exact: true }).click();
    await vi.runAllTimersAsync();

    await expect.element(dialog).not.toBeInTheDocument();

    await expect
      .element(page.getByRole('button', { name: 'test node', exact: true }))
      .toBeVisible();

    await page.getByRole('button', { name: 'test node', exact: true }).click();

    await expect.element(page.getByText('test content', { exact: true })).toBeVisible();
  });

  it('it does not allow adding node with validation errors', async () => {
    await page.getByRole('button', { name: 'Add new node', exact: true }).click();

    const dialog = page.getByRole('dialog');

    await expect
      .element(dialog.getByRole('button', { name: 'Add Node', exact: true }))
      .toBeInTheDocument();

    await userEvent.fill(dialog.getByPlaceholder('Enter node name'), 'test node');
    await userEvent.fill(dialog.getByPlaceholder('Enter node content'), 'test content');
    await vi.runAllTimersAsync();

    await expect
      .element(dialog.getByRole('button', { name: 'Add Node', exact: true }))
      .toBeEnabled();

    await userEvent.clear(dialog.getByPlaceholder('Enter node name'));
    await userEvent.clear(dialog.getByPlaceholder('Enter node content'));
    await vi.runAllTimersAsync();

    await expect.element(dialog.getByPlaceholder('Enter node name')).toBeInvalid();
    await expect.element(dialog.getByPlaceholder('Enter node name')).toBeInvalid();
    await expect.element(dialog.getByText('Node name is required')).toBeVisible();
    await expect.element(dialog.getByText('Node content is required')).toBeVisible();
    await expect
      .element(dialog.getByRole('button', { name: 'Add Node', exact: true }))
      .toBeDisabled();
  });

  it('can edit existing node', async () => {
    await page.getByRole('button', { name: 'Edit selected node', exact: true }).click();

    const dialog = page.getByRole('dialog');

    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('button', { name: 'Edit Node', exact: true }))
      .toBeEnabled();

    await userEvent.fill(dialog.getByPlaceholder('Enter node name'), 'changed node');
    await userEvent.fill(dialog.getByPlaceholder('Enter node content'), 'changed content');
    await vi.runAllTimersAsync();

    await expect
      .element(dialog.getByRole('button', { name: 'Edit Node', exact: true }))
      .toBeEnabled();

    await dialog.getByRole('button', { name: 'Edit Node', exact: true }).click();
    await vi.runAllTimersAsync();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect
      .element(page.getByRole('button', { name: 'changed node', exact: true }))
      .toBeVisible();

    await expect.element(page.getByText('changed content', { exact: true })).toBeVisible();
  });
});
