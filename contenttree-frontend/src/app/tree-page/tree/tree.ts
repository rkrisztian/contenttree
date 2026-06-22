import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { LoadingService } from '../../core/loading-indicator/loading.service';
import { TreeNodeData, TreePageService } from '../tree-page.service';
import { TreeScrollService } from './tree-scroll.service';

@Component({
  selector: 'app-tree',
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tree {
  private readonly treePageService = inject(TreePageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollService = inject(TreeScrollService);
  private readonly loadingService = inject(LoadingService);

  protected readonly rootNode = this.treePageService.rootNode;
  protected readonly dataSource = toObservable(computed(() => [this.rootNode()!]));

  protected readonly draggedNodeId = signal<number | null>(null);
  protected readonly dragoverNodeId = signal<number | null>(null);

  protected readonly tree = viewChild.required('tree', { read: MatTree });

  constructor() {
    afterNextRender(() => {
      this.tree().expandAll();
      this.scrollService.restoreScrollPosition();
    });
  }

  protected readonly childrenAccessor = (node: TreeNodeData) => node.children ?? [];
  protected readonly hasChild = (node: TreeNodeData) => !!node.children?.length;

  protected readonly isSelected = (nodeId: number) =>
    this.treePageService.selectedNode()?.id === nodeId;
  protected readonly toggleSelect = this.treePageService.toggleSelect;

  protected readonly getFoundStatus = (nodeId: number): 'found' | 'notFound' | null => {
    const searchResults = this.treePageService.foundNodes();
    if (!searchResults) return null;
    return searchResults.has(nodeId) ? 'found' : 'notFound';
  };

  protected readonly isDragging = (nodeId: number) => this.draggedNodeId() === nodeId;
  protected readonly isDraggedOver = (nodeId: number) => this.dragoverNodeId() === nodeId;

  protected readonly isLoading = this.loadingService.isLoading;

  protected readonly startDragging = (event: DragEvent, nodeId: number): void => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'move';

    this.draggedNodeId.set(nodeId);
  };

  protected readonly stopDragging = (): void => {
    this.draggedNodeId.set(null);
    this.dragoverNodeId.set(null);
  };

  protected readonly startDragover = (event: DragEvent, dragoverNodeId: number): void => {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';

    this.dragoverNodeId.set(dragoverNodeId === this.draggedNodeId() ? null : dragoverNodeId);
  };

  protected readonly stopDragover = (event: DragEvent, newParentId: number): void => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    this.treePageService
      .moveNode(this.draggedNodeId()!, newParentId)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.dragoverNodeId.set(null);
  };
}
