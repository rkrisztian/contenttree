import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TreePageService } from '../tree-page.service';

@Component({
  selector: 'app-content-panel',
  imports: [MatCardModule, MatDividerModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './content-panel.html',
  styleUrl: './content-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPanel {
  private readonly treePageService = inject(TreePageService);

  protected readonly selectedNode = this.treePageService.selectedNode;
  protected readonly content = this.treePageService.contentForSelectedNode;
}
