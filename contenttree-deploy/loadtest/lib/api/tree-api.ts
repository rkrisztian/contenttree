import { check } from 'k6';
import http from 'k6/http';
import type {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TreeNodeRespDTO,
  UpdateTreeNodeReqDTO,
} from '../../../api/schema';
import { URLSearchParams } from '../../vendor/url.js';
import { BASE_URL } from '../constants.ts';

const BASE_PATH = 'api/tree';

export class TreeApi {
  constructor(private readonly token: string) {}

  readonly getFlatNodes = () => {
    const res = http.get(`${BASE_URL}/${BASE_PATH}`, this.authHeaders());
    const success = check(res, { 'status is 200': (r) => r.status === 200 });
    return success ? (res.json() as TreeNodeRespDTO[]) : undefined;
  };

  readonly getContentForSelectedNode = (selectedNodeId: number) => {
    const res = http.get(
      `${BASE_URL}/${BASE_PATH}/content/${encodeURIComponent(selectedNodeId)}`,
      this.authHeaders(),
    );
    const success = check(res, { 'status is 200': (r) => r.status === 200 });
    return success ? (res.json() as ContentRespDto) : undefined;
  };

  readonly getFoundNodes = (searchText: string) => {
    const res = http.get(
      `${BASE_URL}/${BASE_PATH}/search?${new URLSearchParams([['text', searchText]])}`,
      this.authHeaders(),
    );
    const success = check(res, { 'status is 200': (r) => r.status === 200 });
    return success ? (res.json() as number[]) : undefined;
  };

  readonly createNode = (node: CreateTreeNodeReqDTO) => {
    const res = http.put(`${BASE_URL}/${BASE_PATH}`, JSON.stringify(node), this.authHeaders());
    return check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  };

  readonly updateNode = (node: UpdateTreeNodeReqDTO) => {
    const res = http.post(`${BASE_URL}/${BASE_PATH}`, JSON.stringify(node), this.authHeaders());
    return check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  };

  readonly deleteNode = (id: number) => {
    const res = http.del(
      `${BASE_URL}/${BASE_PATH}/${encodeURIComponent(id)}`,
      undefined,
      this.authHeaders(),
    );
    return check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  };

  readonly moveNode = (nodeId: number, newParentId: number) => {
    const res = http.post(
      `${BASE_URL}/${BASE_PATH}/move?${new URLSearchParams([
        ['nodeId', String(nodeId)],
        ['newParentId', String(newParentId)],
      ])}`,
      undefined,
      this.authHeaders(),
    );
    return check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
  };

  private readonly authHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };
  };
}
