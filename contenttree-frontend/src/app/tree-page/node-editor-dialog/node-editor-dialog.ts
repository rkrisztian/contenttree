import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { debounce, form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TreeNodeData, TreePageService } from '../tree-page.service';

export interface NodeEditorFormData {
  name: string;
  content: string;
}

export interface NodeEditorDialogData {
  createMode: boolean;
  selectedNode: TreeNodeData | null;
}

@Component({
  selector: 'app-node-editor-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './node-editor-dialog.html',
  styleUrl: './node-editor-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeEditorDialog {
  protected readonly data = inject(DIALOG_DATA) as NodeEditorDialogData;
  private readonly dialogRef = inject(DialogRef);
  private readonly treePageService = inject(TreePageService);

  protected readonly content = this.treePageService.contentForSelectedNode;
  private readonly nodeEditorModel = signal<NodeEditorFormData>({
    name: this.data.createMode ? '' : this.data.selectedNode!.name,
    content: this.data.createMode ? '' : (this.content.value()?.data ?? ''),
  });
  protected readonly nodeEditorForm = form(this.nodeEditorModel, (schemaPath) => {
    debounce(schemaPath.name, 250);
    debounce(schemaPath.content, 250);

    required(schemaPath.name, { message: 'Node name is required' });
    required(schemaPath.content, { message: 'Node content is required' });
  });

  protected close = () => {
    this.dialogRef.close();
  };

  protected confirm = () => {
    this.dialogRef.close({
      name: this.nodeEditorForm.name().value(),
      content: this.nodeEditorForm.content().value(),
    });
  };
}
