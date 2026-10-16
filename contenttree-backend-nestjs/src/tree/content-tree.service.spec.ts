import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContentTreeService } from './content-tree.service.js';
import { CreateNodeException } from './exception/create-node.exception.js';
import { MoveNodeException } from './exception/move-node.exception.js';
import { NodeNotFoundException } from './exception/node-not-found.exception.js';
import { ParentNodeNotFoundException } from './exception/parent-node-not-found.exception.js';
import { TreeNodeWithContent } from './model/tree-node-with-content.entity.js';
import { TreeNode } from './model/tree-node.entity.js';
import { TreeNodeWithContentRepository } from './repository/tree-node-with-content.repository.js';
import { TreeNodeRepository } from './repository/tree-node.repository.js';

vi.mock('@nestjs-cls/transactional', async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    Transactional: () => vi.fn(),
  };
});

describe('ContentTreeService', () => {
  let service: ContentTreeService;
  let treeNodeWithContentRepo: TreeNodeWithContentRepository;
  let treeNodeRepo: TreeNodeRepository;

  const rootNode = createTreeNodeWithContent(1, 'dummy text', 'dummy content', null);
  const childNode = createTreeNodeWithContent(2, 'dummy text 2', 'dummy content 2', 1);
  const grandchildNode = createTreeNodeWithContent(3, 'dummy text 3', 'dummy content 3', 2);
  const childNode2 = createTreeNodeWithContent(4, 'dummy text 4', 'dummy content 4', 1);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentTreeService,
        {
          provide: TreeNodeWithContentRepository,
          useValue: {
            existsById: vi.fn(),
            existsByParentId: vi.fn(),
            save: vi.fn(),
            findOneById: vi.fn(),
            findByNameOrContentContainingIgnoreCase: vi.fn(),
          },
        },
        {
          provide: TreeNodeRepository,
          useValue: {
            existsById: vi.fn(),
            deleteByIdRecursively: vi.fn(),
            findOneById: vi.fn(),
            setParentId: vi.fn(),
            isDescendant: vi.fn(),
            find: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentTreeService>(ContentTreeService);
    treeNodeWithContentRepo = module.get<TreeNodeWithContentRepository>(
      TreeNodeWithContentRepository,
    );
    treeNodeRepo = module.get<TreeNodeRepository>(TreeNodeRepository);
  });

  describe('createNode', () => {
    it('should create root node', async () => {
      vi.mocked(treeNodeWithContentRepo.existsByParentId).mockResolvedValue(false);
      vi.mocked(treeNodeWithContentRepo.save).mockResolvedValue(rootNode);

      const result = await service.createNode(rootNode);

      expect.soft(result).toEqual(rootNode);
      expect.soft(treeNodeWithContentRepo.save).toHaveBeenCalledWith(rootNode);
    });

    it('should not create root node twice', async () => {
      vi.mocked(treeNodeWithContentRepo.existsByParentId).mockResolvedValue(true);

      await expect(service.createNode(rootNode)).rejects.toThrow(CreateNodeException);
    });

    it('should create child node', async () => {
      vi.mocked(treeNodeWithContentRepo.existsById).mockResolvedValue(true);
      vi.mocked(treeNodeWithContentRepo.save).mockResolvedValue(childNode);

      const result = await service.createNode(childNode);

      expect.soft(result).toEqual(childNode);
      expect.soft(treeNodeWithContentRepo.save).toHaveBeenCalledWith(childNode);
    });

    it('should not create node with missing parent', async () => {
      vi.mocked(treeNodeWithContentRepo.existsByParentId).mockResolvedValue(false);

      await expect(service.createNode(childNode)).rejects.toThrow(ParentNodeNotFoundException);
    });
  });

  describe('updateNode', () => {
    it('should update existing node', async () => {
      vi.mocked(treeNodeWithContentRepo.findOneById).mockResolvedValue(childNode);

      const updatedNode = createTreeNodeWithContent(2, 'updated name', 'updated content', 1);
      await service.updateNode(updatedNode);

      expect.soft(childNode.name).toBe('updated name');
      expect.soft(childNode.content).toBe('updated content');
    });

    it('should not update missing node', async () => {
      vi.mocked(treeNodeWithContentRepo.findOneById).mockResolvedValue(null);

      await expect(service.updateNode(rootNode)).rejects.toThrow(NodeNotFoundException);
    });
  });

  describe('deleteNode', () => {
    it('should delete single node', async () => {
      vi.mocked(treeNodeRepo.existsById).mockResolvedValue(true);
      vi.mocked(treeNodeRepo.deleteByIdRecursively).mockResolvedValue(1);

      await service.deleteNode(rootNode.id);

      expect(treeNodeRepo.deleteByIdRecursively).toHaveBeenCalledWith(rootNode.id);
    });

    it('should not delete non-existing node', async () => {
      vi.mocked(treeNodeRepo.existsById).mockResolvedValue(false);

      await expect(service.deleteNode(rootNode.id)).rejects.toThrow(NodeNotFoundException);
    });
  });

  describe('moveNode', () => {
    it('should move node to valid parent', async () => {
      vi.mocked(treeNodeRepo.findOneById).mockResolvedValue(asTreeNode(childNode));
      vi.mocked(treeNodeRepo.existsById).mockResolvedValue(true);
      vi.mocked(treeNodeRepo.isDescendant).mockResolvedValue(false);

      await service.moveNode(childNode.id, childNode2.id);

      expect(treeNodeRepo.setParentId).toHaveBeenCalledWith(childNode.id, childNode2.id);
    });

    it('should not move node to parent as self', async () => {
      await expect(service.moveNode(childNode.id, childNode.id)).rejects.toThrow(MoveNodeException);
    });

    it('should not move node to missing parent', async () => {
      vi.mocked(treeNodeRepo.findOneById).mockResolvedValue(asTreeNode(grandchildNode));
      vi.mocked(treeNodeRepo.existsById).mockResolvedValue(false);

      await expect(service.moveNode(grandchildNode.id, rootNode.id)).rejects.toThrow(
        ParentNodeNotFoundException,
      );
    });

    it('should not move root node', async () => {
      vi.mocked(treeNodeRepo.findOneById).mockResolvedValue(asTreeNode(rootNode));

      await expect(service.moveNode(rootNode.id, childNode.id)).rejects.toThrow(MoveNodeException);
    });

    it('should not move node to same parent', async () => {
      vi.mocked(treeNodeRepo.findOneById).mockResolvedValue(asTreeNode(childNode));

      await expect(service.moveNode(childNode.id, rootNode.id)).rejects.toThrow(MoveNodeException);
    });
  });
});

const createTreeNodeWithContent = (
  id: number,
  name: string,
  content: string,
  parentId: number | null,
): TreeNodeWithContent => {
  const node = new TreeNodeWithContent();
  node.id = id;
  node.name = name;
  node.content = content;
  node.parentId = parentId;
  return node;
};

const asTreeNode = (node: TreeNodeWithContent): TreeNode => {
  const treeNode = new TreeNode();
  treeNode.id = node.id;
  treeNode.name = node.name;
  treeNode.parentId = node.parentId;
  return treeNode;
};
