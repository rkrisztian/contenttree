import { HttpResourceRef } from '@angular/common/http';
import { computed, signal, Signal } from '@angular/core';
import { of } from 'rxjs';
import {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TreeApiService,
  TreeNodeRespDTO,
  UpdateTreeNodeReqDTO,
} from '../app/api/tree-api.service';
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
  isLoading?: Signal<boolean>;
  reload?: () => boolean;
}

const mockHttpResourceDefaults: Partial<MockHttpResourceOpts<never>> = {
  hasValue: signal(true),
  error: signal(undefined),
  isLoading: signal(false),
  reload: () => true,
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
  flatNodesAfterCreate: (node: CreateTreeNodeReqDTO) => TreeNodeRespDTO[];
  flatNodesAfterUpdate: (node: UpdateTreeNodeReqDTO) => TreeNodeRespDTO[];
  flatNodesAfterMove: (nodeId: number, newParentId: number) => TreeNodeRespDTO[];

  contents: Record<number, ContentRespDto>;
  contentsAfterCreate: (node: CreateTreeNodeReqDTO) => Record<number, ContentRespDto>;
  contentsAfterUpdate: (node: UpdateTreeNodeReqDTO) => Record<number, ContentRespDto>;

  foundNodes: (searchText: string) => number[];
}

export class MockTreeApiService implements Partial<TreeApiService> {
  readonly flatNodes: HttpResourceRef<TreeNodeRespDTO[]>;
  private contents: Record<number, ContentRespDto>;

  constructor(private readonly mockData: TreeApiServiceMockData) {
    this.flatNodes = mockHttpResource({ value: signal(this.mockData.flatNodes) });
    this.contents = this.mockData.contents;
  }

  contentForSelectedNode = (selectedNode: Signal<TreeNodeData | null>) =>
    mockHttpResource({
      hasValue: computed(() => !!selectedNode()),
      value: computed(() =>
        // @ts-expect-error: Already checked for null.
        selectedNode() ? this.contents[selectedNode().id] : undefined,
      ),
    });

  createNode = (node: CreateTreeNodeReqDTO) => {
    this.flatNodes.value.set(this.mockData.flatNodesAfterCreate(node));
    this.contents = this.mockData.contentsAfterCreate(node);
    return of();
  };

  updateNode = (node: UpdateTreeNodeReqDTO) => {
    this.flatNodes.value.set(this.mockData.flatNodesAfterUpdate(node));
    this.contents = this.mockData.contentsAfterUpdate(node);
    return of();
  };

  moveNode = (nodeId: number, newParentId: number) => {
    this.flatNodes.value.set(this.mockData.flatNodesAfterMove(nodeId, newParentId));
    return of({});
  };

  foundNodes = (searchText: Signal<string>) =>
    mockHttpResource({
      hasValue: computed(() => !!searchText()),
      value: computed(() => (searchText ? this.mockData.foundNodes(searchText()) : undefined)),
    });
}
