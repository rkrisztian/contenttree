import { AuthService } from '@/app/core/auth/auth.service';
import { LoadingService } from '@/app/core/loading-indicator/loading.service';
import { TreePageService } from '@/app/tree-page/tree-page.service';
import { TreeScrollService } from '@/app/tree-page/tree/tree-scroll.service';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tree',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
})
export class Tree {
  private readonly treePageService = inject(TreePageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollService = inject(TreeScrollService);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);

  protected readonly treeData = this.treePageService.treeData;
  protected readonly expansionState = this.treePageService.expansionState;

  protected readonly draggedNodeId = signal<number | null>(null);
  protected readonly dragoverNodeId = signal<number | null>(null);

  protected readonly isManager = this.authService.isManager;

  private readonly treeItems = viewChildren<ElementRef<HTMLDivElement>>('treeitem');

  constructor() {
    afterNextRender(() => {
      this.scrollService.restoreScrollPosition();
    });
  }

  protected readonly toggleExpanded = (event: Event | null, nodeId: number) => {
    event?.stopPropagation();
    this.expansionState().toggleExpanded(nodeId, this.treeData());
  };

  protected readonly isSelected = (nodeId: number) =>
    this.treePageService.selectedNodeId() === nodeId;
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

  handleKeyDown(event: KeyboardEvent, nodeId: number) {
    const treeItems = this.treeItems().map((ref) => ref.nativeElement);
    const currentIndex = treeItems.indexOf(document.activeElement as HTMLDivElement);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = treeItems[(currentIndex + 1) % treeItems.length]!;
        next.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = treeItems[(currentIndex - 1 + treeItems.length) % treeItems.length]!;
        prev.focus();
        break;
      }
      case 'Enter':
        event.preventDefault();
        this.toggleSelect(nodeId);
        break;
      case ' ': {
        event.preventDefault();
        this.toggleExpanded(null, nodeId);
        break;
      }
    }
  }
}
