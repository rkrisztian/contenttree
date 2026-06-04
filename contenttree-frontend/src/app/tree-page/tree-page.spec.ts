import { render } from 'vitest-browser-angular';
import { page, userEvent } from 'vitest/browser';
import { MockTreeApiService } from '../../test-utils/mock-factory';
import { treeApiServiceMockDataForHappyCase } from '../../test-utils/test-data';
import { TreeApiService } from '../api/tree-api.service';
import { ContentPanel } from './content-panel/content-panel';
import { TreePage } from './tree-page';
import { TreePageService } from './tree-page.service';
import { TreeToolbar } from './tree-toolbar/tree-toolbar';
import { Tree } from './tree/tree';

describe('TreePage', () => {
  beforeEach(async () => {
    vi.useFakeTimers();

    // See reasoning about network mocking in `mock-factory.ts`.
    await render(TreePage, {
      componentProviders: [
        TreeToolbar,
        Tree,
        ContentPanel,
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

  it('can search for nodes', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Grand');
    await vi.runAllTimersAsync();

    await expect
      .element(page.getByRole('button', { name: 'Grandchild node matched', exact: true }))
      .toBeVisible();

    for (const name of ['Root node', 'Child node', 'Child node 2']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });
});
