import { render } from 'vitest-browser-angular';
import { page, userEvent } from 'vitest/browser';
import { MockTreeApiService } from '../../../test-utils/mock-factory';
import { treeApiServiceMockDataForHappyCase } from '../../../test-utils/test-data';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePage } from '../tree-page';
import { TreePageService } from '../tree-page.service';

describe('TreeToolbar', () => {
  beforeEach(async () => {
    vi.useFakeTimers();

    // See reasoning about network mocking in `mock-factory.ts`.
    await render(TreePage, {
      componentProviders: [
        TreePageService,
        {
          provide: TreeApiService,
          useValue: new MockTreeApiService(treeApiServiceMockDataForHappyCase),
        },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not allow adding/editing/deleting if no node is selected', async () => {
    await page.getByRole('button', { name: 'Root node', exact: true }).click();

    for (const name of ['Add new node', 'Edit selected node', 'Delete selected node']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeDisabled();
    }
  });

  it('does not allow deleting the root node', async () => {
    await expect
      .element(page.getByRole('button', { name: 'Delete selected node', exact: true }))
      .toBeDisabled();
  });

  it('can search for nodes', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Grand');
    await vi.runAllTimersAsync();

    await expect.element(page.getByPlaceholder('Search nodes')).toBeValid();
    await expect
      .element(page.getByRole('button', { name: 'Grandchild node matched', exact: true }))
      .toBeVisible();

    for (const name of ['Root node', 'Child node', 'Child node 2']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });

  it('will not start a search under 3 characters', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Gr');
    await userEvent.tab();
    await vi.runAllTimersAsync();

    await expect.element(page.getByPlaceholder('Search nodes')).toBeInvalid();
    await expect.element(page.getByText('At least 3 characters are required')).toBeVisible();
  });
  it('can clear search', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Grand');
    await vi.runAllTimersAsync();

    await expect
      .element(page.getByRole('button', { name: 'Grandchild node matched', exact: true }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Clear search', exact: true }).click();
    await vi.runAllTimersAsync();

    await expect.element(page.getByPlaceholder('Search nodes')).toBeValid();
    await expect
      .element(page.getByRole('button', { name: 'Grandchild node matched', exact: true }))
      .not.toBeInTheDocument();
  });
});
