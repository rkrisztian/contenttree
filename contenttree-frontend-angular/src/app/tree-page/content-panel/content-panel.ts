import { TreePageService } from '@/app/tree-page/tree-page.service';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateBlockDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-content-panel',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslateBlockDirective,
  ],
  templateUrl: './content-panel.html',
  styleUrl: './content-panel.scss',
})
export class ContentPanel {
  private readonly treePageService = inject(TreePageService);

  private readonly treeData = this.treePageService.treeData;
  private readonly selectedNodeId = this.treePageService.selectedNodeId;
  protected readonly selectedNode = computed(() =>
    this.selectedNodeId() ? this.treeData().getNodebyId(this.selectedNodeId()!) : null,
  );
  protected readonly content = this.treePageService.contentForSelectedNode;
}
