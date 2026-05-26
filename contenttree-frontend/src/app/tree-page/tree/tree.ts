import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { TreeNodeData, TreePageService } from '../tree-page.service';

@Component({
  selector: 'app-tree',
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tree {
  private readonly treePageService = inject(TreePageService);
  private destroyRef = inject(DestroyRef);

  readonly rootNode = this.treePageService.rootNode;
  protected readonly dataSource = toObservable(computed(() => [this.rootNode()!]));

  protected readonly draggedNodeId = signal<number | null>(null);
  protected readonly dragoverNodeId = signal<number | null>(null);

  @ViewChild('tree', { read: MatTree })
  protected readonly tree!: MatTree<TreeNodeData>;

  constructor() {
    afterNextRender(() => {
      this.tree.expandAll();
    });
  }

  protected childrenAccessor = (node: TreeNodeData) => node.children ?? [];
  protected hasChild = (node: TreeNodeData) => !!node.children?.length;

  protected isSelected = (nodeId: number) => this.treePageService.selectedNode()?.id === nodeId;
  protected toggleSelect = this.treePageService.toggleSelect;

  protected hasSearchResults = () => this.treePageService.foundNodes() != null;
  protected isFound = (nodeId: number) => this.treePageService.foundNodes()?.has(nodeId) ?? false;

  protected isDragging = (nodeId: number) => this.draggedNodeId() === nodeId;
  protected isDraggedOver = (nodeId: number) => this.dragoverNodeId() === nodeId;

  protected startDragging = (event: DragEvent, nodeId: number): void => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';

    this.draggedNodeId.set(nodeId);
  };

  protected stopDragging = (): void => {
    this.draggedNodeId.set(null);
    this.dragoverNodeId.set(null);
  };

  protected startDragover = (event: DragEvent, dragoverNodeId: number): void => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';

    this.dragoverNodeId.set(dragoverNodeId !== this.draggedNodeId() ? dragoverNodeId : null);
  };

  protected stopDragover = (event: DragEvent, newParentId: number): void => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    this.treePageService
      .moveNode(this.draggedNodeId()!, newParentId)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.dragoverNodeId.set(null);
  };
}
