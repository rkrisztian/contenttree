import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../environments/environment';
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

  readonly flatNodes = httpResource<TreeNodeRespDTO[]>(() => environment.apiBaseUrl);

  readonly createContentForSelectedNode = (selectedNode: Signal<TreeNodeData | null>) =>
    httpResource<ContentRespDto>(() =>
      selectedNode() == null
        ? undefined
        : // @ts-expect-error: Already checked for null.
          `${environment.apiBaseUrl}/content/${encodeURIComponent(selectedNode().id)}`,
    );

  readonly createFoundNodes = (searchText: Signal<string>) =>
    httpResource<number[]>(() =>
      searchText()
        ? { url: `${environment.apiBaseUrl}/search`, params: { text: searchText() } }
        : undefined,
    ).asReadonly();

  readonly createNode = (node: CreateTreeNodeReqDTO) => this.http.put(environment.apiBaseUrl, node);

  readonly updateNode = (node: UpdateTreeNodeReqDTO) =>
    this.http.post(environment.apiBaseUrl, node);

  readonly deleteNode = (id: number) =>
    this.http.delete(`${environment.apiBaseUrl}/${encodeURIComponent(id)}`);

  readonly moveNode = (nodeId: number, newParentId: number) =>
    this.http.post(`${environment.apiBaseUrl}/move`, null, { params: { nodeId, newParentId } });
}
