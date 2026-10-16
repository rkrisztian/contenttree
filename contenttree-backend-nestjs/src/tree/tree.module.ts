import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { ContentTreeController } from './content-tree.controller.js';
import { ContentTreeService } from './content-tree.service.js';
import { TreeNodeWithContent } from './model/tree-node-with-content.entity.js';
import { TreeNode } from './model/tree-node.entity.js';
import { TreeNodeWithContentRepository } from './repository/tree-node-with-content.repository.js';
import { TreeNodeRepository } from './repository/tree-node.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([TreeNode, TreeNodeWithContent]), AuthModule],
  providers: [ContentTreeService, TreeNodeRepository, TreeNodeWithContentRepository],
  controllers: [ContentTreeController],
})
export class TreeModule {}
