import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { TreeNodeData } from '../tree-page/tree-page.service';
import { components } from './schema';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];
export type ContentRespDto = components['schemas']['ContentRespDto'];
export type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];
export type UpdateTreeNodeReqDTO = components['schemas']['UpdateTreeNodeReqDTO'];

@Injectable({
  providedIn: 'root',
})
export class TreeApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  readonly treeApiBaseUrl = computed(() => `${this.config.apiBaseUrl()}/api/tree`);

  readonly flatNodes = httpResource<TreeNodeRespDTO[]>(() => this.treeApiBaseUrl());

  readonly contentForSelectedNode = (selectedNode: Signal<TreeNodeData | null>) =>
    httpResource<ContentRespDto>(() =>
      selectedNode() == null
        ? undefined
        : // @ts-expect-error: Already checked for null.
          `${this.treeApiBaseUrl()}/content/${encodeURIComponent(selectedNode().id)}`,
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
