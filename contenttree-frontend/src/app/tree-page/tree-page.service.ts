import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  CreateTreeNodeReqDTO,
  TreeApiService,
  UpdateTreeNodeReqDTO,
} from '../api/tree-api.service';
import { ErrorService } from '../core/error.service';

export interface TreeNodeData {
  id: number;
  name: string;
  parentId: number | null;
  children: TreeNodeData[];
}

@Injectable({ providedIn: 'root' })
export class TreePageService {
  private readonly treeApiService = inject(TreeApiService);
  private readonly errorService = inject(ErrorService);

  private readonly _flatNodes = this.treeApiService.flatNodes;
  readonly flatNodes = this._flatNodes.asReadonly();
  private readonly nodesById = computed(() => {
    const flatNodes = this.flatNodes.hasValue() ? (this.flatNodes.value() ?? []) : [];
    return new Map(flatNodes.map((node) => [node.id, node]));
  });
  readonly rootNode = computed(() => this.buildTree());

  readonly selectedNode = linkedSignal(() => this.rootNode());
  private readonly _contentForSelectedNode = this.treeApiService.contentForSelectedNode(
    this.selectedNode,
  );
  readonly contentForSelectedNode = this._contentForSelectedNode.asReadonly();

  readonly searchText = signal('');
  private readonly _foundNodes = this.treeApiService.foundNodes(this.searchText);
  readonly foundNodes = computed(() =>
    this._foundNodes.hasValue() ? new Set(this._foundNodes.value()) : undefined,
  );

  private readonly buildTree = (): TreeNodeData | null => {
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

  readonly toggleSelect = (newSelectedNode: TreeNodeData | null) => {
    this.selectedNode.update((node) => (node?.id === newSelectedNode?.id ? null : newSelectedNode));
  };

  readonly createNode = (node: CreateTreeNodeReqDTO) => {
    return this.treeApiService.createNode(node).pipe(tap(() => this._flatNodes.reload()));
  };

  readonly updateNode = (node: UpdateTreeNodeReqDTO) => {
    return this.treeApiService.updateNode(node).pipe(
      tap(() => {
        this._flatNodes.reload();

        if (node.id === this.selectedNode()?.id) {
          this._contentForSelectedNode.reload();
        }
      }),
    );
  };

  readonly deleteNode = (id: number) =>
    this.treeApiService.deleteNode(id).pipe(
      tap(() => {
        this._flatNodes.reload();
        this.toggleSelect(null);
      }),
    );

  readonly moveNode = (nodeId: number, newParentId: number) => {
    if (
      nodeId === newParentId ||
      this.isRoot(nodeId) ||
      this.isParent(newParentId, nodeId) ||
      this.isDescendant(newParentId, nodeId)
    ) {
      this.errorService.addAndShow({
        error: 'Cannot perform operation',
        message: 'The requested move operation is invalid.',
      });

      return undefined;
    }

    return this.treeApiService.moveNode(nodeId, newParentId).pipe(
      tap(() => {
        this._flatNodes.reload();
        this.toggleSelect(null);
      }),
    );
  };

  private readonly isRoot = (nodeId: number): boolean => {
    return this.rootNode()?.id === nodeId;
  };

  private readonly isParent = (newParentId: number, nodeId: number): boolean =>
    this.nodesById().get(nodeId)?.parentId === newParentId;

  /** Checks if the node with ID `newParentId` is a descendant of that with `nodeId`. */
  private readonly isDescendant = (newParentId: number, nodeId: number): boolean => {
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
