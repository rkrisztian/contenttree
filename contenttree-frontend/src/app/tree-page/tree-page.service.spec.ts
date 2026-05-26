import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorService } from '../core/error.service';
import { ContentRespDto, TreeNodeRespDTO, TreePageService } from './tree-page.service';

describe('TreePageService', () => {
  let treePageService: TreePageService;
  let errorService: ErrorService;
  let httpTesting: HttpTestingController;

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
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    treePageService = TestBed.inject(TreePageService);
    errorService = TestBed.inject(ErrorService);
  });

  describe('rootNode and contentForSelectedNode', () => {
    it('should load a one-node tree with content', async () => {
      await withMockData({ flatNodes: [{ id: 1, name: 'dummy name' }], content }, () => {
        expect(treePageService.rootNode()).toHaveProperty('id', 1);
        expect(treePageService.contentForSelectedNode.value()).toEqual(content);
      });
    });

    it('should map child elements to parent', async () => {
      await withMockData({ flatNodes: testFlatNodes, content }, () => {
        expect(treePageService.rootNode()).toMatchObject({
          id: 1,
          children: [
            expect.objectContaining({ id: 2, children: [expect.objectContaining({ id: 4 })] }),
            expect.objectContaining({ id: 3 }),
          ],
        });
      });
    });

    it('should return null if there are no elements', async () => {
      await withMockData({ flatNodes: [], content: null }, () => {
        expect(treePageService.rootNode()).toBeNullable();
        expect(treePageService.contentForSelectedNode.value()).toBeNullable();
      });
    });

    const withMockData = async (
      mockData: { flatNodes: TreeNodeRespDTO[]; content: ContentRespDto | null },
      callback: () => void,
    ) => {
      TestBed.tick();
      httpTesting.expectOne((req) => req.method === 'GET').flush(mockData.flatNodes);
      await vi.waitUntil(() => treePageService.flatNodes.hasValue());

      if (mockData.content) {
        httpTesting.expectOne((req) => req.method === 'GET').flush(mockData.content);
        await vi.waitUntil(() => treePageService.contentForSelectedNode.hasValue());
      }

      callback();
      httpTesting.verify();
    };
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
      treePageService.flatNodes.set(testFlatNodes);
      const promise = treePageService.moveNode(nodeId, newParentId);

      if (shouldFail) {
        expect.soft(errorService.errorData(), 'should display error').toHaveProperty('error');
        expect.soft(promise, 'moveNode API should not be called').toBeUndefined();
      } else {
        expect.soft(errorService.errorData(), 'should not display error').toBeNull();
        expect.soft(promise, 'moveNode API should be called').toBeDefined();
      }
    });
  });
});
