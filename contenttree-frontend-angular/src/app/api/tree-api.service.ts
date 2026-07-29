import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, Signal } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import type {
  ContentRespDto,
  CreateTreeNodeReqDTO,
  TreeNodeRespDTO,
  UpdateTreeNodeReqDTO,
} from './types';

export const TREE_API_BASE_PATH = '/api/tree';

@Service()
export class TreeApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  private readonly treeApiBaseUrl = computed(
    () => `${this.config.apiBaseUrl()}${TREE_API_BASE_PATH}`,
  );

  readonly rawNodes = httpResource<TreeNodeRespDTO[]>(() => this.treeApiBaseUrl());

  readonly contentForSelectedNode = (selectedNodeId: Signal<number | null>) =>
    httpResource<ContentRespDto>(() =>
      selectedNodeId()
        ? `${this.treeApiBaseUrl()}/content/${encodeURIComponent(selectedNodeId()!)}`
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
