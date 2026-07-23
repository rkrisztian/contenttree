import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { TREE_API_BASE_URL } from '../../test-utils/msw-mocks';
import { it } from '../../test-utils/msw-test';
import { ContentRespDto, TREE_API_BASE_PATH } from '../api/tree-api.service';
import { ErrorService } from '../core/error-handler/error.service';
import { TreePageService } from './tree-page.service';

describe('TreePageService', () => {
  let treePageService: TreePageService;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreePageService],
    });

    treePageService = TestBed.inject(TreePageService);
    errorService = TestBed.inject(ErrorService);
  });

  describe('rootNode and contentForSelectedNode', () => {
    it('should load a one-node tree with content', async ({ server }) => {
      const testContent: ContentRespDto = {
        data: 'test content',
      };

      server.use(
        http.get(TREE_API_BASE_URL, () => HttpResponse.json([{ id: 1, name: 'dummy name' }])),
        http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
          expect(params['id']).toEqual('1');
          return HttpResponse.json(testContent);
        }),
      );

      await TestBed.inject(ApplicationRef).whenStable();

      expect.soft(treePageService.treeData().rootNodeId).toBe(1);
      expect.soft(treePageService.contentForSelectedNode.value()).toEqual(testContent);
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
    ])('$name', async ({ nodeId, newParentId, shouldFail }) => {
      await TestBed.inject(ApplicationRef).whenStable();

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
