import { AnyHandler, http, HttpResponse } from 'msw';
import {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TREE_API_BASE_PATH,
  TreeNodeRespDTO,
} from '../app/api/tree-api.service';
import { environment } from '../environments/environment';

let flatNodes: TreeNodeRespDTO[] = [
  { id: 1, name: 'Root node' },
  { id: 2, name: 'Child node', parentId: 1 },
  { id: 3, name: 'Child node 2', parentId: 1 },
  { id: 4, name: 'Grandchild node', parentId: 2 },
];

let contents: Record<string, ContentRespDto> = {
  '1': { data: 'Content for root node' },
  '2': { data: 'Content for child node' },
  '3': { data: 'Content for child node 2' },
  '4': { data: 'Content for grandchild node' },
};

export const TREE_API_BASE_URL = `${environment.apiBaseUrl}${TREE_API_BASE_PATH}`;

export const handlers: AnyHandler[] = [
  http.get(TREE_API_BASE_URL, () => HttpResponse.json(flatNodes)),

  http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
    const { id } = params as { id: string };

    if (id in contents) {
      return HttpResponse.json(contents[id]);
    }

    throw new Error(`Unexpected ID: ${id}`);
  }),

  http.get(`${TREE_API_BASE_URL}/search`, ({ request }) => {
    const queryParams = new URL(request.url).searchParams;

    switch (queryParams.get('text')) {
      case 'Grand':
        return HttpResponse.json([4]);
      case 'NonExisting':
        return HttpResponse.json([]);
      default:
        throw new Error(`Unexpected text: ${queryParams.get('text')}`);
    }
  }),

  http.put(TREE_API_BASE_URL, async ({ request }) => {
    const node = (await request.json()) as CreateTreeNodeReqDTO;

    if (node.name === 'test node') {
      flatNodes = [
        { id: 1, name: 'Root node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
        { id: 5, name: 'test node', parentId: 1 },
      ];
      contents = {
        1: { data: 'Content for root node' },
        2: { data: 'Content for child node' },
        3: { data: 'Content for child node 2' },
        4: { data: 'Content for grandchild node' },
        5: { data: 'test content' },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected node: ${node.name}`);
  }),

  http.post(TREE_API_BASE_URL, async ({ request }) => {
    const node = (await request.json()) as CreateTreeNodeReqDTO;

    if (node.name === 'changed node') {
      flatNodes = [
        { id: 1, name: 'changed node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
      ];
      contents = {
        1: { data: 'changed content' },
        2: { data: 'Content for child node' },
        3: { data: 'Content for child node 2' },
        4: { data: 'Content for grandchild node' },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected node: ${node.name}`);
  }),

  http.delete(`${TREE_API_BASE_URL}/:id`, ({ params }) => {
    const { id } = params as { id: string };

    if (id === '2') {
      flatNodes = [
        { id: 1, name: 'Root node' },
        { id: 3, name: 'Child node 2', parentId: 1 },
      ];
      contents = {
        1: { data: 'Content for root node' },
        3: { data: 'Content for child node 2' },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected ID: ${id}`);
  }),

  http.post(`${TREE_API_BASE_URL}/move`, async ({ request }) => {
    const queryParams = new URL(request.url).searchParams;

    if (queryParams.get('nodeId') === '4' && queryParams.get('newParentId') === '1') {
      flatNodes = [
        { id: 1, name: 'Root node' },
        { id: 2, name: 'Child node', parentId: 1 },
        { id: 3, name: 'Child node 2', parentId: 1 },
        { id: 4, name: 'Grandchild node', parentId: 1 },
      ];
      return HttpResponse.json({});
    }

    throw new Error(
      `Unexpected move: ${queryParams.get('nodeId')} to ${queryParams.get('newParentId')}`,
    );
  }),

  http.all('http://localhost:63315/*', async () => undefined),
];
