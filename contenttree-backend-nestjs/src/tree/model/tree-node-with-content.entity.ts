import { Column, Entity } from 'typeorm';
import { BaseTreeNode } from './base-tree-node.entity.js';

@Entity({ name: 'tree_node' })
export class TreeNodeWithContent extends BaseTreeNode {
  @Column({ type: 'text', nullable: false })
  content: string;
}
