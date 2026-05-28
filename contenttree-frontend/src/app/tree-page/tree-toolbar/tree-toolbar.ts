import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, form, FormField, minLength } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NodeDeleteDialog, NodeDeleteDialogData } from '../node-delete-dialog/node-delete-dialog';
import {
  NodeEditorDialog,
  NodeEditorDialogData,
  NodeEditorFormData,
} from '../node-editor-dialog/node-editor-dialog';
import { TreePageService } from '../tree-page.service';

interface SearchFormData {
  searchText: string;
}

@Component({
  selector: 'app-tree-toolbar',
  imports: [MatIconModule, MatInputModule, MatButtonModule, MatIconModule, DialogModule, FormField],
  templateUrl: './tree-toolbar.html',
  styleUrls: ['./tree-toolbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  private static readonly SEARCH_DELAY_IN_MS = 500;

  private readonly treePageService = inject(TreePageService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly selectedNode = this.treePageService.selectedNode;
  protected readonly rootNode = this.treePageService.rootNode;

  private readonly searchModel = signal<SearchFormData>({
    searchText: '',
  });
  protected readonly searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.searchText, Toolbar.SEARCH_DELAY_IN_MS);

    minLength(schemaPath.searchText, 3, { message: 'At least 3 characters are required' });
  });

  constructor() {
    effect(() => {
      if (!this.searchForm().invalid()) {
        this.treePageService.searchText.set(this.searchForm.searchText().value());
      }
    });
  }

  protected addOrEditNode = (createMode: boolean): void => {
    const dialogRef = this.dialog.open<NodeEditorFormData, NodeEditorDialogData>(NodeEditorDialog, {
      panelClass: 'content-tree-dialog',
      data: {
        createMode,
        selectedNode: this.selectedNode(),
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: NodeEditorFormData | undefined) => {
        if (!data) {
          return;
        }

        if (createMode) {
          this.treePageService
            .createNode({
              ...data,
              ...(this.selectedNode() ? { parentId: this.selectedNode()!.id } : {}),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        } else {
          this.treePageService.updateNode({ id: this.selectedNode()!.id, ...data }).subscribe();
        }
      });
  };

  protected deleteNode = (): void => {
    const dialogRef = this.dialog.open<boolean, NodeDeleteDialogData>(NodeDeleteDialog, {
      panelClass: 'content-tree-dialog',
      data: {
        node: this.selectedNode()!,
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.treePageService
            .deleteNode(this.selectedNode()!.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });
  };
}
