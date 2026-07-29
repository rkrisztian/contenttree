import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TreeNodeData } from '../tree-data';

export interface NodeDeleteDialogData {
  allNodesToDelete: TreeNodeData[];
}

@Component({
  selector: 'app-node-delete-dialog',
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './node-delete-dialog.html',
  styleUrl: './node-delete-dialog.scss',
})
export class NodeDeleteDialog {
  private readonly data = inject(DIALOG_DATA) as NodeDeleteDialogData;
  private readonly dialogRef = inject(DialogRef);

  protected readonly allNodesToDelete = this.data.allNodesToDelete;
  protected readonly nodeToDelete = this.allNodesToDelete[0]!;

  protected cancel = () => {
    this.dialogRef.close();
  };

  protected confirm = () => {
    this.dialogRef.close(true);
  };
}
