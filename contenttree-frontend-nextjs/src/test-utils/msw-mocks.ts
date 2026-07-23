import { type AnyHandler, HttpResponse, http } from "msw";
import { AUTH_API_BASE_PATH, type LoginReqDto, type LoginRespDto } from "@/app/_lib/auth-api";
import { REMOTE_CONFIG_PATH, type RemoteConfig } from "@/app/api/config/route";
import {
  type ContentRespDto,
  type CreateTreeNodeReqDTO,
  TREE_API_BASE_PATH,
  type TreeNodeRespDTO,
} from "@/app/tree/_lib/tree-api";

export const TREE_API_BASE_URL = `${process.env["API_BASE_URL"]}${TREE_API_BASE_PATH}`;
export const AUTH_API_BASE_URL = `${process.env["API_BASE_URL"]}${AUTH_API_BASE_PATH}`;

const INITIAL_RAW_NODES: TreeNodeRespDTO[] = [
  { id: 1, name: "Root node" },
  { id: 2, name: "Child node", parentId: 1 },
  { id: 3, name: "Child node 2", parentId: 1 },
  { id: 4, name: "Grandchild node", parentId: 2 },
];

const INITIAL_CONTENTS: Record<string, ContentRespDto> = {
  "1": { data: "Content for root node" },
  "2": { data: "Content for child node" },
  "3": { data: "Content for child node 2" },
  "4": { data: "Content for grandchild node" },
};

let rawNodes = INITIAL_RAW_NODES;
let contents = INITIAL_CONTENTS;

export const LOGIN_DATA = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiJ9.I9KBzS2NKnwOi5KmcP038Apxx6j_oPOpLyAvzFiBpgQ", // NOSONAR: test-only token
  username: "admin",
  role: "ADMIN",
  expiration: new Date(Date.now() + 60 * 60 * 1000).toString(), // 1 hour later
} as LoginRespDto;

export const handlers: AnyHandler[] = [
  http.get(REMOTE_CONFIG_PATH, () =>
    HttpResponse.json({ apiBaseUrl: process.env["API_BASE_URL"]! } satisfies RemoteConfig),
  ),

  http.get(TREE_API_BASE_URL, () => HttpResponse.json(rawNodes)),

  http.get(`${TREE_API_BASE_URL}/content/:id`, ({ params }) => {
    const { id } = params as { id: string };

    if (id in contents) {
      return HttpResponse.json(contents[id]);
    }

    throw new Error(`Unexpected ID: ${id}`);
  }),

  http.get(`${TREE_API_BASE_URL}/search`, ({ request }) => {
    const queryParams = new URL(request.url).searchParams;

    switch (queryParams.get("text")) {
      case "Grand":
        return HttpResponse.json([4]);
      case "NonExisting":
        return HttpResponse.json([]);
      default:
        throw new Error(`Unexpected text: ${queryParams.get("text")}`);
    }
  }),

  http.put(TREE_API_BASE_URL, async ({ request }) => {
    const node = (await request.json()) as CreateTreeNodeReqDTO;

    if (node.name === "test node") {
      rawNodes = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node", parentId: 1 },
        { id: 3, name: "Child node 2", parentId: 1 },
        { id: 4, name: "Grandchild node", parentId: 1 },
        { id: 5, name: "test node", parentId: 1 },
      ];
      contents = {
        1: { data: "Content for root node" },
        2: { data: "Content for child node" },
        3: { data: "Content for child node 2" },
        4: { data: "Content for grandchild node" },
        5: { data: "test content" },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected node: ${node.name}`);
  }),

  http.post(TREE_API_BASE_URL, async ({ request }) => {
    const node = (await request.json()) as CreateTreeNodeReqDTO;

    if (node.name === "changed node") {
      rawNodes = [
        { id: 1, name: "changed node" },
        { id: 2, name: "Child node", parentId: 1 },
        { id: 3, name: "Child node 2", parentId: 1 },
        { id: 4, name: "Grandchild node", parentId: 1 },
      ];
      contents = {
        1: { data: "changed content" },
        2: { data: "Content for child node" },
        3: { data: "Content for child node 2" },
        4: { data: "Content for grandchild node" },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected node: ${node.name}`);
  }),

  http.delete(`${TREE_API_BASE_URL}/:id`, ({ params }) => {
    const { id } = params as { id: string };

    if (id === "2") {
      rawNodes = [
        { id: 1, name: "Root node" },
        { id: 3, name: "Child node 2", parentId: 1 },
      ];
      contents = {
        1: { data: "Content for root node" },
        3: { data: "Content for child node 2" },
      };
      return HttpResponse.json({});
    }

    throw new Error(`Unexpected ID: ${id}`);
  }),

  http.post(`${TREE_API_BASE_URL}/move`, ({ request }) => {
    const queryParams = new URL(request.url).searchParams;

    if (queryParams.get("nodeId") === "4" && queryParams.get("newParentId") === "1") {
      rawNodes = [
        { id: 1, name: "Root node" },
        { id: 2, name: "Child node", parentId: 1 },
        { id: 3, name: "Child node 2", parentId: 1 },
        { id: 4, name: "Grandchild node", parentId: 1 },
      ];
      return HttpResponse.json({});
    }

    throw new Error(
      `Unexpected move: ${queryParams.get("nodeId")} to ${queryParams.get("newParentId")}`,
    );
  }),

  http.post(`${AUTH_API_BASE_URL}/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as LoginReqDto;

    if (username === "admin" && password === "secret") {
      return HttpResponse.json(LOGIN_DATA);
    }

    throw new Error(`Unexpected login: ${username}:${password}`);
  }),

  http.all("http://localhost:63315/*", () => undefined),
];

export const resetMswMocks = () => {
  rawNodes = INITIAL_RAW_NODES;
  contents = INITIAL_CONTENTS;
};
