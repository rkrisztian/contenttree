import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentPanel } from './content-panel/content-panel';
import { TreePageService } from './tree-page.service';
import { Toolbar } from './tree-toolbar/tree-toolbar';
import { Tree } from './tree/tree';

@Component({
  selector: 'app-tree-page',
  templateUrl: './tree-page.html',
  styleUrl: './tree-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Tree,
    ContentPanel,
    Toolbar,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
})
export class TreePage {
  private readonly treePageService = inject(TreePageService);

  protected readonly flatNodes = this.treePageService.flatNodes.asReadonly();
  protected readonly rootNode = this.treePageService.rootNode;
  protected readonly selectedNode = this.treePageService.selectedNode;
}
