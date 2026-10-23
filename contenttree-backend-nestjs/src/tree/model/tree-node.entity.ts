import { Entity } from 'typeorm';
import { BaseTreeNode } from './base-tree-node.entity.js';

@Entity({ name: 'tree_node' })
export class TreeNode extends BaseTreeNode {}
