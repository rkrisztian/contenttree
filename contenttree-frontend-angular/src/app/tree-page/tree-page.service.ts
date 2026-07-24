import { afterNextRender, computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  CreateTreeNodeReqDTO,
  TreeApiService,
  UpdateTreeNodeReqDTO,
} from '../api/tree-api.service';
import { ErrorService } from '../core/error-handler/error.service';
import { TreeData } from './tree-data';
import { TreeExpansionState } from './tree-expansion-state';
import { TreeScrollService } from './tree/tree-scroll.service';

@Injectable()
export class TreePageService {
  private readonly treeApiService = inject(TreeApiService);
  private readonly treeScrollService = inject(TreeScrollService);
  private readonly errorService = inject(ErrorService);

  private readonly _rawNodes = this.treeApiService.rawNodes;
  readonly rawNodes = this._rawNodes.asReadonly();
  readonly treeData = computed(
    () => new TreeData(this._rawNodes.hasValue() ? this._rawNodes.value() : []),
  );

  readonly expansionState = signal(new TreeExpansionState(), {
    equal: (a, b) => a.isEqual(b),
  });

  // Keep previous selection, otherwise default to rootNode.
  // Ensure that after editing a node, selectedNode gets the updated data.
  readonly selectedNodeId = linkedSignal<number | null, number | null>({
    source: () => this.treeData().rootNodeId,
    computation: (rootNodeId, previousRootNodeId) =>
      previousRootNodeId?.value ? previousRootNodeId.value : rootNodeId,
  });
  private readonly _contentForSelectedNode = this.treeApiService.contentForSelectedNode(
    computed(() => this.selectedNodeId()),
  );
  readonly contentForSelectedNode = this._contentForSelectedNode.asReadonly();

  readonly searchText = signal('');
  private readonly _foundNodes = this.treeApiService.foundNodes(this.searchText);
  readonly foundNodes = computed(() =>
    this._foundNodes.hasValue() ? new Set(this._foundNodes.value()) : undefined,
  );

  constructor() {
    afterNextRender(() => {
      if (this._rawNodes.error()) {
        this._rawNodes.reload();
      }
    });
  }

  readonly toggleSelect = (newSelectedNodeId: number | null) => {
    this.selectedNodeId.update((nodeId) =>
      nodeId === newSelectedNodeId ? null : newSelectedNodeId,
    );
  };

  readonly createNode = (node: CreateTreeNodeReqDTO) => {
    return this.treeApiService.createNode(node).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._rawNodes.reload();
      }),
    );
  };

  readonly updateSelectedNode = (data: Omit<UpdateTreeNodeReqDTO, 'id'>) => {
    return this.treeApiService.updateNode({ id: this.selectedNodeId()!, ...data }).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._rawNodes.reload();
        this._contentForSelectedNode.reload();
      }),
    );
  };

  readonly deleteSelectedNode = () =>
    this.treeApiService.deleteNode(this.selectedNodeId()!).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._rawNodes.reload();
        this.selectedNodeId.set(this.treeData().getNodebyId(this.selectedNodeId()!).parentId);
        this.expansionState().sync(this.treeData());
      }),
    );

  readonly moveNode = (nodeId: number, newParentId: number) => {
    if (!this.treeData().isValidMove(nodeId, newParentId)) {
      this.errorService.addAndShow({
        error: 'Cannot perform operation',
        message: 'The requested move operation is invalid.',
      });

      return undefined;
    }

    return this.treeApiService.moveNode(nodeId, newParentId).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._rawNodes.reload();
      }),
    );
  };
}
