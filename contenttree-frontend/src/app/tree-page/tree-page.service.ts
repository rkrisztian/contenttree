import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  CreateTreeNodeReqDTO,
  TreeApiService,
  UpdateTreeNodeReqDTO,
} from '../api/tree-api.service';
import { ErrorService } from '../core/error.service';
import { TreeScrollService } from './tree/tree-scroll.service';

export interface TreeNodeData {
  id: number;
  name: string;
  parentId: number | null;
  children: TreeNodeData[];
}

@Injectable({ providedIn: 'root' })
export class TreePageService {
  private readonly treeApiService = inject(TreeApiService);
  private readonly treeScrollService = inject(TreeScrollService);
  private readonly errorService = inject(ErrorService);

  private readonly _flatNodes = this.treeApiService.flatNodes;
  readonly flatNodes = this._flatNodes.asReadonly();
  private readonly builtTree = computed(() => this.buildTree());
  readonly rootNode = computed(() => this.builtTree().root);
  private readonly nodesById = computed(() => this.builtTree().nodesById);

  // Keep previous selection, otherwise default to rootNode.
  // Ensure that after editing a node, selectedNode gets the updated data.
  readonly selectedNode = linkedSignal<TreeNodeData | null, TreeNodeData | null>({
    source: () => this.rootNode(),
    computation: (rootNode, previousRootNode) =>
      previousRootNode?.value ? this.nodesById().get(previousRootNode.value.id)! : rootNode,
  });
  private readonly _contentForSelectedNode = this.treeApiService.contentForSelectedNode(
    this.selectedNode,
  );
  readonly contentForSelectedNode = this._contentForSelectedNode.asReadonly();

  readonly searchText = signal('');
  private readonly _foundNodes = this.treeApiService.foundNodes(this.searchText);
  readonly foundNodes = computed(() =>
    this._foundNodes.hasValue() ? new Set(this._foundNodes.value()) : undefined,
  );

  private readonly buildTree = () => {
    const flatNodes = this.flatNodes.hasValue() ? (this.flatNodes.value() ?? []) : [];
    const nodesById = new Map(
      flatNodes.map((node) => [node.id, { ...node, children: [] } as TreeNodeData]),
    );
    let root: TreeNodeData | null = null;

    for (const node of nodesById.values()) {
      if (node.parentId == null) {
        root = node;
      } else {
        const parent = nodesById.get(node.parentId)!;
        parent.children.push(node);
      }
    }

    return { root, nodesById };
  };

  readonly toggleSelect = (newSelectedNode: TreeNodeData | null) => {
    this.selectedNode.update((node) => (node?.id === newSelectedNode?.id ? null : newSelectedNode));
  };

  readonly createNode = (node: CreateTreeNodeReqDTO) => {
    return this.treeApiService.createNode(node).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._flatNodes.reload();
      }),
    );
  };

  readonly updateSelectedNode = (data: Omit<UpdateTreeNodeReqDTO, 'id'>) => {
    return this.treeApiService.updateNode({ id: this.selectedNode()!.id, ...data }).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._flatNodes.reload();
        this._contentForSelectedNode.reload();
      }),
    );
  };

  readonly deleteSelectedNode = () =>
    this.treeApiService.deleteNode(this.selectedNode()!.id).pipe(
      tap(() => {
        this.treeScrollService.saveScrollPosition();
        this._flatNodes.reload();
        this.toggleSelect(this.nodesById().get(this.selectedNode()!.parentId!)!);
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
        this.treeScrollService.saveScrollPosition();
        this._flatNodes.reload();
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
