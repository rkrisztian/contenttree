import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CreateNodeException } from './exception/create-node.exception.js';
import { MoveNodeException } from './exception/move-node.exception.js';
import { NodeNotFoundException } from './exception/node-not-found.exception.js';
import { ParentNodeNotFoundException } from './exception/parent-node-not-found.exception.js';
import { isRoot } from './model/base-tree-node.entity.js';
import { TreeNodeWithContent } from './model/tree-node-with-content.entity.js';
import { TreeNode } from './model/tree-node.entity.js';
import { TreeNodeWithContentRepository } from './repository/tree-node-with-content.repository.js';
import { TreeNodeRepository } from './repository/tree-node.repository.js';

@Injectable()
export class ContentTreeService {
  constructor(
    private readonly treeNodeWithContentRepo: TreeNodeWithContentRepository,
    private readonly treeNodeRepo: TreeNodeRepository,
  ) {}

  @Transactional()
  async createNode(node: TreeNodeWithContent): Promise<TreeNodeWithContent> {
    if (isRoot(node) && (await this.treeNodeWithContentRepo.existsByParentId(null))) {
      throw new CreateNodeException('Root node already exists');
    }
    if (!isRoot(node) && !(await this.treeNodeWithContentRepo.existsById(node.parentId!))) {
      throw new ParentNodeNotFoundException();
    }

    return this.treeNodeWithContentRepo.save(node);
  }

  @Transactional()
  async updateNode(input: TreeNodeWithContent): Promise<void> {
    const node = await this.treeNodeWithContentRepo.findOneById(input.id);

    if (!node) {
      throw new NodeNotFoundException();
    }

    node.name = input.name;
    node.content = input.content;
    // TODO: Need?
    await this.treeNodeWithContentRepo.save(node);
  }

  @Transactional()
  async deleteNode(id: number): Promise<void> {
    if (!(await this.treeNodeRepo.existsById(id))) {
      throw new NodeNotFoundException();
    }

    await this.treeNodeRepo.deleteByIdRecursively(id);
  }

  async getTree(): Promise<TreeNode[]> {
    return this.treeNodeRepo.find();
  }

  async getContentById(id: number): Promise<string> {
    const node = await this.treeNodeWithContentRepo.findOneById(id);

    if (!node) {
      throw new NodeNotFoundException();
    }

    return node.content;
  }

  async findText(substring: string): Promise<number[]> {
    return this.treeNodeWithContentRepo.findByNameOrContentContainingIgnoreCase(substring);
  }

  @Transactional()
  async moveNode(nodeId: number, newParentId: number): Promise<void> {
    await this.validateMove(nodeId, newParentId);
    await this.treeNodeRepo.setParentId(nodeId, newParentId);
  }

  private async validateMove(nodeId: number, newParentId: number): Promise<void> {
    if (newParentId === nodeId) {
      throw new MoveNodeException('Parent node cannot be self');
    }

    const node = await this.treeNodeRepo.findOneById(nodeId);

    if (!node) {
      throw new NodeNotFoundException();
    }
    if (isRoot(node)) {
      throw new MoveNodeException('Root node cannot be moved');
    }
    if (node.parentId === newParentId) {
      throw new MoveNodeException('Move would have no effect');
    }
    if (await this.treeNodeRepo.isDescendant(newParentId, nodeId)) {
      throw new MoveNodeException('Node cannot be moved into a descendant');
    }
    if (!(await this.treeNodeRepo.existsById(newParentId))) {
      throw new ParentNodeNotFoundException();
    }
  }
}
