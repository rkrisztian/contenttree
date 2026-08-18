import { TreeNodeData } from '@/app/tree-page/tree-data';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { debounce, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateBlockDirective, TranslateService } from '@ngx-translate/core';

export interface NodeEditorDialogData {
  createMode: boolean;
  selectedNode: TreeNodeData | null;
  content: string | undefined;
}

export interface NodeEditorFormData {
  name: string;
  content: string;
}

@Component({
  selector: 'app-node-editor-dialog',
  imports: [
    FormRoot,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateBlockDirective,
  ],
  templateUrl: './node-editor-dialog.html',
  styleUrl: './node-editor-dialog.scss',
})
export class NodeEditorDialog {
  protected readonly data = inject(DIALOG_DATA) as NodeEditorDialogData;
  private readonly translate = inject(TranslateService);
  private readonly dialogRef = inject(DialogRef);

  private readonly nodeEditorModel = signal<NodeEditorFormData>({
    name: this.data.createMode ? '' : this.data.selectedNode!.name,
    content: this.data.createMode ? '' : this.data.content!,
  });
  protected readonly nodeEditorForm = form(
    this.nodeEditorModel,
    (schemaPath) => {
      debounce(schemaPath.name, 250);
      debounce(schemaPath.content, 250);

      required(schemaPath.name, {
        message: this.translate.translate('tree-page.node-editor-dialog.node-name-field-required'),
      });
      required(schemaPath.content, {
        message: this.translate.translate(
          'tree-page.node-editor-dialog.node-content-field-required',
        ),
      });
    },
    {
      submission: {
        action: async () => {
          this.confirm();
        },
      },
    },
  );

  protected readonly close = () => {
    this.dialogRef.close();
  };

  private readonly confirm = () => {
    this.dialogRef.close({
      name: this.nodeEditorForm.name().value(),
      content: this.nodeEditorForm.content().value(),
    });
  };
}
