import { render } from 'vitest-browser-angular';
import { page, userEvent } from 'vitest/browser';
import { MockTreeApiService } from '../../../test-utils/mock-factory';
import { treeApiServiceMockDataForHappyCase } from '../../../test-utils/test-data';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePageService } from '../tree-page.service';
import { TreeToolbar } from '../tree-toolbar/tree-toolbar';

describe('TreeToolbar', () => {
  let treePageService: TreePageService;

  beforeEach(async () => {
    vi.useFakeTimers();

    // See reasoning about network mocking in `mock-factory.ts`.
    const screen = await render(TreeToolbar, {
      componentProviders: [
        TreePageService,
        {
          provide: TreeApiService,
          useValue: new MockTreeApiService(treeApiServiceMockDataForHappyCase),
        },
      ],
    });

    treePageService = screen.fixture.debugElement.injector.get(TreePageService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('can search for nodes', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Grand');
    await vi.runAllTimersAsync();

    // Found no simple way to check for text color change.
    expect(treePageService.foundNodes()).toEqual(new Set([4]));
  });

  it('will not start a search under 3 characters', async () => {
    await userEvent.fill(page.getByPlaceholder('Search nodes'), 'Gr');
    await vi.runAllTimersAsync();

    // Did not find a way to check for the validation error message.
    expect(treePageService.foundNodes()).toEqual(undefined);
  });
});
