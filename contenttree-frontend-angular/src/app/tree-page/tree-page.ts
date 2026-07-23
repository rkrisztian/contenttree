import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentPanel } from './content-panel/content-panel';
import { TreePageService } from './tree-page.service';
import { TreeToolbar } from './tree-toolbar/tree-toolbar';
import { Tree } from './tree/tree';
import { TreeScrollService } from './tree/tree-scroll.service';

@Component({
  selector: 'app-tree-page',
  templateUrl: './tree-page.html',
  styleUrl: './tree-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Tree,
    TreeToolbar,
    ContentPanel,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  providers: [TreePageService],
})
export class TreePage {
  private readonly treePageService = inject(TreePageService);
  private readonly treeScrollService = inject(TreeScrollService);

  protected readonly rawNodes = this.treePageService.rawNodes;
  protected readonly treeData = this.treePageService.treeData;

  private readonly treeContainer = viewChild.required<ElementRef>('treeContainer');

  constructor() {
    afterNextRender(() => {
      this.treeScrollService.containerElementRef.set(this.treeContainer());
      this.treeScrollService.restoreScrollPosition();
    });
  }
}
