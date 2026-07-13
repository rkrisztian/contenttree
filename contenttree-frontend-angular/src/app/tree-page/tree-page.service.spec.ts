import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { TREE_API_BASE_URL } from '../../test-utils/msw-mocks';
import { it } from '../../test-utils/msw-test';
import {
  ContentRespDto,
  TREE_API_BASE_PATH,
  TreeApiService,
  TreeNodeRespDTO,
} from '../api/tree-api.service';
import { ErrorService } from '../core/error-handler/error.service';
import { TreePageService } from './tree-page.service';

describe('TreePageService', () => {
  let treeApiService: TreeApiService;
  let treePageService: TreePageService;
  let errorService: ErrorService;

  const testRawNodes: TreeNodeRespDTO[] = [
    { id: 1, name: 'Root node' },
    { id: 2, name: 'Child node', parentId: 1 },
    { id: 3, name: 'Child node 2', parentId: 1 },
    { id: 4, name: 'Grandchild node', parentId: 2 },
  ];
  const content: ContentRespDto = {
    data: 'test content',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    treeApiService = TestBed.inject(TreeApiService);
    treePageService = TestBed.inject(TreePageService);
    errorService = TestBed.inject(ErrorService);
  });

  describe('rootNode and contentForSelectedNode', () => {
    it('should load a one-node tree with content', async ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_URL, () => HttpResponse.json([{ id: 1, name: 'dummy name' }])),
        http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
          expect(params['id']).toEqual('1');
          return HttpResponse.json(content);
        }),
      );

      await TestBed.inject(ApplicationRef).whenStable();

      expect.soft(treePageService.treeData().rootNodeId).toBe(1);
      expect.soft(treePageService.contentForSelectedNode.value()).toEqual(content);
    });

    it('should return null if there are no elements', ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_PATH, () => HttpResponse.json([])),
        http.get(`${TREE_API_BASE_PATH}/content/:id`, () => {
          throw new Error('Not expected to be called');
        }),
      );

      expect.soft(treePageService.treeData().nodes[0]).toBeNullable();
      expect.soft(treePageService.contentForSelectedNode.value()).toBeNullable();
    });
  });

  describe('moveNode', () => {
    it.each([
      {
        name: 'should move node with valid inputs',
        nodeId: 4,
        newParentId: 1,
        shouldFail: false,
      },
      {
        name: 'should not move node to self',
        nodeId: 2,
        newParentId: 2,
        shouldFail: true,
      },
    ])('$name', ({ nodeId, newParentId, shouldFail }) => {
      treeApiService.rawNodes.set(testRawNodes);
      const promise = treePageService.moveNode(nodeId, newParentId);

      if (shouldFail) {
        expect.soft(errorService.latestError(), 'should display error').toBeDefined();
        expect.soft(promise, 'moveNode API should not be called').toBeUndefined();
      } else {
        expect.soft(errorService.latestError(), 'should not display error').toBeNull();
        expect.soft(promise, 'moveNode API should be called').toBeDefined();
      }
    });
  });
});
