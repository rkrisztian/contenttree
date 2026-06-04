import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { TreeNodeData } from '../tree-page/tree-page.service';
import { components } from './schema';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];
export type ContentRespDto = components['schemas']['ContentRespDto'];
export type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];
export type UpdateTreeNodeReqDTO = components['schemas']['UpdateTreeNodeReqDTO'];

export const TREE_API_BASE_PATH = '/api/tree';
export const TREE_API_BASE_URL = `${environment.apiBaseUrl}${TREE_API_BASE_PATH}`;

@Injectable({
  providedIn: 'root',
})
export class TreeApiService {
  private readonly http = inject(HttpClient);

  readonly flatNodes = httpResource<TreeNodeRespDTO[]>(() => TREE_API_BASE_URL);

  readonly contentForSelectedNode = (selectedNode: Signal<TreeNodeData | null>) =>
    httpResource<ContentRespDto>(() =>
      selectedNode() == null
        ? undefined
        : // @ts-expect-error: Already checked for null.
          `${TREE_API_BASE_URL}/content/${encodeURIComponent(selectedNode().id)}`,
    );

  readonly foundNodes = (searchText: Signal<string>) =>
    httpResource<number[]>(() =>
      searchText()
        ? { url: `${TREE_API_BASE_URL}/search`, params: { text: searchText() } }
        : undefined,
    ).asReadonly();

  readonly createNode = (node: CreateTreeNodeReqDTO) => this.http.put(TREE_API_BASE_URL, node);

  readonly updateNode = (node: UpdateTreeNodeReqDTO) => this.http.post(TREE_API_BASE_URL, node);

  readonly deleteNode = (id: number) =>
    this.http.delete(`${TREE_API_BASE_URL}/${encodeURIComponent(id)}`);

  readonly moveNode = (nodeId: number, newParentId: number) =>
    this.http.post(`${TREE_API_BASE_URL}/move`, null, { params: { nodeId, newParentId } });
}
