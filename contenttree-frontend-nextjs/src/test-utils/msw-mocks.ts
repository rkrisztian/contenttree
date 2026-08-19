import { type AnyHandler, HttpResponse, http } from "msw";
import { AUTH_API_BASE_PATH } from "@/app/_lib/api/auth-api";
import type {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  LoginReqDto,
  LoginRespDto,
  TreeNodeRespDTO,
} from "@/app/_lib/api/types";
import { REMOTE_CONFIG_PATH, type RemoteConfig } from "@/app/api/config/route";
import { TREE_API_BASE_PATH } from "@/app/tree/_lib/api/tree-api";

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

export const LOGIN_RESP: Readonly<LoginRespDto> = {
  token:
    "eyJhbGciOiJIUzI1NiJ9." +
    "eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4NDg5MzA5MiwiZXhwIjoxNzg0ODk2NjkyfQ." +
    "erJgVOVJrKzySG52n62y3dhCpk-ecAfAugWZqmyM0v8",
};

export const REMOTE_CONFIG_RESP: Readonly<RemoteConfig> = {
  apiBaseUrl: process.env["API_BASE_URL"]!,
  company: {
    name: "Example Company",
    address: "Example Address",
    privacyEmail: "example@company.com",
    dataRetentionDays: 90,
  },
};

export const handlers: AnyHandler[] = [
  http.get(REMOTE_CONFIG_PATH, () => HttpResponse.json(REMOTE_CONFIG_RESP)),

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
      return HttpResponse.json(LOGIN_RESP);
    }

    throw new Error(`Unexpected login: ${username}:${password}`);
  }),

  http.all("http://localhost:63315/*", () => undefined),
];

export const resetMswMocks = () => {
  rawNodes = INITIAL_RAW_NODES;
  contents = INITIAL_CONTENTS;
};
