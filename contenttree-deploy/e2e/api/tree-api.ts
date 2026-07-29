import { APIRequestContext } from '@playwright/test';
import { CreateTreeNodeReqDTO } from './types/models/CreateTreeNodeReqDTO.js';
import { TreeNodeRespDTO } from './types/models/TreeNodeRespDTO.js';

type Headers = { [key: string]: string };

const apiUrl = '/api/tree';

export const createNode = async (
  request: APIRequestContext,
  headers: Headers,
  node: CreateTreeNodeReqDTO,
) => {
  const createResponse = await request.put(apiUrl, { headers, data: node });

  if (!createResponse.ok()) {
    throw new Error(`Failed to create node: ${await createResponse.text()}`);
  }
};

export const listNodes = async (request: APIRequestContext, headers: Headers) => {
  const listResponse = await request.get(apiUrl, { headers });

  if (!listResponse.ok()) {
    throw new Error(`Failed to list nodes: ${await listResponse.text()}`);
  }

  return (await listResponse.json()) as TreeNodeRespDTO[];
};

export const deleteNode = async (request: APIRequestContext, headers: Headers, nodeId: number) => {
  const deleteResponse = await request.delete(`${apiUrl}/${nodeId}`, { headers });

  if (!deleteResponse.ok()) {
    throw new Error(`Failed to delete root node: ${await deleteResponse.text()}`);
  }
};
