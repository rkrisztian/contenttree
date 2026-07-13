import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { components } from './schema';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];
export type ContentRespDto = components['schemas']['ContentRespDto'];
export type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];
export type UpdateTreeNodeReqDTO = components['schemas']['UpdateTreeNodeReqDTO'];

export const TREE_API_BASE_PATH = '/api/tree';

@Injectable({
  providedIn: 'root',
})
export class TreeApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  readonly treeApiBaseUrl = computed(() => `${this.config.apiBaseUrl()}${TREE_API_BASE_PATH}`);

  readonly rawNodes = httpResource<TreeNodeRespDTO[]>(() => this.treeApiBaseUrl());

  readonly contentForSelectedNode = (selectedNodeId: Signal<number | null>) =>
    httpResource<ContentRespDto>(() =>
      selectedNodeId()
        ? // @ts-expect-error: Already checked for null.
          `${this.treeApiBaseUrl()}/content/${encodeURIComponent(selectedNodeId())}`
        : undefined,
    );

  readonly foundNodes = (searchText: Signal<string>) =>
    httpResource<number[]>(() =>
      searchText()
        ? { url: `${this.treeApiBaseUrl()}/search`, params: { text: searchText() } }
        : undefined,
    ).asReadonly();

  readonly createNode = (node: CreateTreeNodeReqDTO) => this.http.put(this.treeApiBaseUrl(), node);

  readonly updateNode = (node: UpdateTreeNodeReqDTO) => this.http.post(this.treeApiBaseUrl(), node);

  readonly deleteNode = (id: number) =>
    this.http.delete(`${this.treeApiBaseUrl()}/${encodeURIComponent(id)}`);

  readonly moveNode = (nodeId: number, newParentId: number) =>
    this.http.post(`${this.treeApiBaseUrl()}/move`, null, { params: { nodeId, newParentId } });
}
