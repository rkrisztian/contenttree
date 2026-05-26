import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { components } from '../api/schema';
import { ErrorService } from '../core/error.service';

export type TreeNodeRespDTO = components['schemas']['TreeNodeRespDTO'];
export type ContentRespDto = components['schemas']['ContentRespDto'];
export type SearchResultsRespDto = components['schemas']['SearchResultsRespDto'];
export type CreateTreeNodeReqDTO = components['schemas']['CreateTreeNodeReqDTO'];
export type UpdateTreeNodeReqDTO = components['schemas']['UpdateTreeNodeReqDTO'];

export interface TreeNodeData {
  id: number;
  name: string;
  parentId: number | null;
  children: TreeNodeData[];
}

@Injectable({ providedIn: 'root' })
export class TreePageService {
  private readonly http = inject(HttpClient);
  private errorService = inject(ErrorService);

  readonly flatNodes = httpResource<TreeNodeRespDTO[]>(() => environment.apiBaseUrl);
  private readonly nodesById = computed(() => {
    const flatNodes = this.flatNodes.hasValue() ? (this.flatNodes.value() ?? []) : [];
    return new Map(flatNodes.map((node) => [node.id, node]));
  });
  readonly rootNode = computed(() => this.buildTree());

  readonly selectedNode = linkedSignal(() => this.rootNode());
  private readonly _contentForSelectedNode = httpResource<ContentRespDto>(() =>
    this.selectedNode() != null
      ? `${environment.apiBaseUrl}/content/${encodeURIComponent(this.selectedNode()!.id)}`
      : undefined,
  );
  readonly contentForSelectedNode = this._contentForSelectedNode.asReadonly();

  readonly searchText = signal('');
  private readonly _foundNodes = httpResource<SearchResultsRespDto>(() =>
    this.searchText()
      ? {
          url: `${environment.apiBaseUrl}/search`,
          params: { text: this.searchText() },
        }
      : undefined,
  );
  readonly foundNodes = computed(() =>
    this._foundNodes.hasValue() ? new Set(this._foundNodes.value()?.ids) : undefined,
  );

  private buildTree = (): TreeNodeData | null => {
    const nodeDataById = new Map(
      Array.from(this.nodesById().entries()).map(([nodeId, node]) => [
        nodeId,
        { ...node, children: [] } as TreeNodeData,
      ]),
    );

    let root: TreeNodeData | null = null;

    for (const node of nodeDataById.values()) {
      if (node.parentId == null) {
        root = node;
      } else {
        const parent = nodeDataById.get(node.parentId)!;
        parent.children.push(node);
      }
    }

    return root;
  };

  toggleSelect = (newSelectedNode: TreeNodeData | null) => {
    this.selectedNode.update((node) => (node?.id !== newSelectedNode?.id ? newSelectedNode : null));
  };

  createNode = (node: CreateTreeNodeReqDTO) => {
    return this.http.put(environment.apiBaseUrl, node).pipe(tap(() => this.flatNodes.reload()));
  };

  updateNode = (node: UpdateTreeNodeReqDTO) => {
    return this.http.post(environment.apiBaseUrl, node).pipe(
      tap(() => {
        this.flatNodes.reload();

        if (node.id === this.selectedNode()?.id) {
          this._contentForSelectedNode.reload();
        }
      }),
    );
  };

  deleteNode = (id: number) =>
    this.http.delete(`${environment.apiBaseUrl}/${encodeURIComponent(id)}`).pipe(
      tap(() => {
        this.flatNodes.reload();
        this.toggleSelect(null);
      }),
    );

  moveNode = (nodeId: number, newParentId: number) => {
    if (
      nodeId === newParentId ||
      this.isRoot(nodeId) ||
      this.isParent(newParentId, nodeId) ||
      this.isDescendant(newParentId, nodeId)
    ) {
      this.errorService.showError({
        error: 'Cannot perform operation',
        message: 'The requested move operation is invalid.',
      });

      return undefined;
    }

    return this.http
      .post(`${environment.apiBaseUrl}/move`, null, {
        params: {
          nodeId,
          newParentId,
        },
      })
      .pipe(
        tap(() => {
          this.flatNodes.reload();
          this.toggleSelect(null);
        }),
      );
  };

  private isRoot = (nodeId: number): boolean => {
    return this.rootNode()?.id === nodeId;
  };

  private isParent = (newParentId: number, nodeId: number): boolean =>
    this.nodesById().get(nodeId)?.parentId === newParentId;

  /** Checks if the node with ID `newParentId` is a descendant of that with `nodeId`. */
  private isDescendant = (newParentId: number, nodeId: number): boolean => {
    const nodesById = this.nodesById();
    let currentId: number | null = newParentId;

    do {
      currentId = nodesById.get(currentId)!.parentId ?? null;

      if (currentId === nodeId) {
        return true;
      }
    } while (currentId != null);

    return false;
  };
}
