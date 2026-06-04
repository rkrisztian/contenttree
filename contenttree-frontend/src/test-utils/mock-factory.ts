import { HttpResourceRef } from '@angular/common/http';
import { computed, signal, Signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ContentRespDto, TreeApiService, TreeNodeRespDTO } from '../app/api/tree-api.service';
import { TreeNodeData } from '../app/tree-page/tree-page.service';

/*
 * Reasons I decided to mock network requests this way:
 *
 * 1. MSW does not work yet with this version of Angular:
 *    https://github.com/angular/angular-cli/issues/32523
 *
 * 2. Chicken-and-egg problem with `HttpTestingController` and the `render` function of Vitest's
 *    browser mode: the application loads content from network on first render, and I see no way
 *    to intercept network requests, because I can only inject `HttpTestingController` once
 *    the `render` function is called.
 *
 * 3. There is no official API yet for mocking httpResource objects yet. See:
 *    https://timdeschryver.dev/blog/writing-resilient-angular-component-tests-that-use-httpresource-with-httptestingcontroller
 */

export interface MockHttpResourceOpts<T> {
  value: Signal<T>;
  hasValue?: Signal<boolean>;
  error?: Signal<Error | undefined>;
  loading?: Signal<boolean>;
  reload?: () => void;
}

const mockHttpResourceDefaults: Partial<MockHttpResourceOpts<never>> = {
  hasValue: signal(true),
  error: signal(undefined),
  loading: signal(false),
  reload: () => {
    /* no behavior intended */
  },
};

export const mockHttpResource = <T>(options: MockHttpResourceOpts<T>) => {
  const httpResource = {
    ...mockHttpResourceDefaults,
    ...options,
  } as unknown as HttpResourceRef<T>;

  httpResource.asReadonly = () => httpResource;

  return httpResource;
};

export interface TreeApiServiceMockData {
  flatNodes: TreeNodeRespDTO[];
  flatNodesAfterMove: (nodeId: number, newParentId: number) => TreeNodeRespDTO[];
  contentForSelectedNode: (selectedNode: TreeNodeData) => ContentRespDto;
  foundNodes: (searchText: string) => number[];
}

export class MockTreeApiService implements Partial<TreeApiService> {
  readonly flatNodes: HttpResourceRef<TreeNodeRespDTO[]>;

  constructor(private readonly mockData: TreeApiServiceMockData) {
    this.flatNodes = mockHttpResource({ value: signal(this.mockData.flatNodes) });
  }

  contentForSelectedNode = (selectedNode: Signal<TreeNodeData | null>) =>
    mockHttpResource({
      hasValue: computed(() => !!selectedNode()),
      value: computed(() =>
        // @ts-expect-error: Already checked for null.
        selectedNode() ? this.mockData.contentForSelectedNode(selectedNode()) : undefined,
      ),
    });

  foundNodes = (searchText: Signal<string>) =>
    mockHttpResource({
      hasValue: computed(() => !!searchText()),
      value: computed(() => (searchText ? this.mockData.foundNodes(searchText()) : undefined)),
    });

  moveNode = vi.fn().mockImplementation((nodeId: number, newParentId: number) => {
    this.flatNodes.value.set(this.mockData.flatNodesAfterMove(nodeId, newParentId));
    return of({});
  });
}
