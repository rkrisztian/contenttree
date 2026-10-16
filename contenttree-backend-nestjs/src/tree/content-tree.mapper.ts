import { CreateTreeNodeReqDTO } from './dto/create-tree-node-req.dto.js';
import { TreeNodeRespDTO } from './dto/tree-node-resp.dto.js';
import { UpdateTreeNodeReqDTO } from './dto/update-tree-node-req.dto.js';
import { TreeNodeWithContent } from './model/tree-node-with-content.entity.js';
import { TreeNode } from './model/tree-node.entity.js';

export class ContentTreeMapper {
  static readonly createDtoToTreeNodeWithContent = (
    dto: CreateTreeNodeReqDTO,
  ): TreeNodeWithContent =>
    ({
      name: dto.name,
      content: dto.content,
      parentId: dto.parentId ?? null,
    }) as TreeNodeWithContent;

  static readonly updateDtoToTreeNodeWithContent = (
    dto: UpdateTreeNodeReqDTO,
  ): TreeNodeWithContent =>
    ({
      id: dto.id,
      name: dto.name,
      content: dto.content,
    }) as TreeNodeWithContent;

  static readonly toTreeNodeRespDTO = (node: TreeNode): TreeNodeRespDTO => {
    return {
      id: node.id,
      parentId: node.parentId,
      name: node.name,
    };
  };
}
