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
import { ErrorService } from '../core/error.service';
import { TreePageService } from './tree-page.service';

describe('TreePageService', () => {
  let treeApiService: TreeApiService;
  let treePageService: TreePageService;
  let errorService: ErrorService;

  const testFlatNodes: TreeNodeRespDTO[] = [
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

      TestBed.tick();
      await TestBed.inject(ApplicationRef).whenStable();

      expect(treePageService.rootNode()).toHaveProperty('id', 1);
      expect(treePageService.contentForSelectedNode.value()).toEqual(content);
    });

    it('should map child elements to parent', async () => {
      TestBed.tick();
      await TestBed.inject(ApplicationRef).whenStable();

      expect(treePageService.rootNode()).toMatchObject({
        id: 1,
        children: [
          expect.objectContaining({ id: 2, children: [expect.objectContaining({ id: 4 })] }),
          expect.objectContaining({ id: 3 }),
        ],
      });
    });

    it('should return null if there are no elements', ({ server }) => {
      server.use(
        http.get(TREE_API_BASE_PATH, () => HttpResponse.json([])),
        http.get(`${TREE_API_BASE_PATH}/content/:id`, () => {
          throw new Error('Not expected to be called');
        }),
      );

      expect(treePageService.rootNode()).toBeNullable();
      expect(treePageService.contentForSelectedNode.value()).toBeNullable();
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
      {
        name: 'should not move root node',
        nodeId: 1,
        newParentId: 2,
        shouldFail: true,
      },
      {
        name: 'should not move node to same parent',
        nodeId: 2,
        newParentId: 1,
        shouldFail: true,
      },
      {
        name: 'should not move node to descendant node',
        nodeId: 2,
        newParentId: 4,
        shouldFail: true,
      },
    ])('$name', async ({ nodeId, newParentId, shouldFail }) => {
      treeApiService.flatNodes.set(testFlatNodes);
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
