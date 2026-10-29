import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles/roles.guard.js';
import { createTestApp, getTestApp } from '../test-utils/test-postgres.js';
import { ContentTreeController } from './content-tree.controller.js';
import { ContentTreeService } from './content-tree.service.js';
import { TreeNodeWithContent } from './model/tree-node-with-content.entity.js';
import { TreeNode } from './model/tree-node.entity.js';
import { TreeNodeWithContentRepository } from './repository/tree-node-with-content.repository.js';
import { TreeNodeRepository } from './repository/tree-node.repository.js';

describe('ContentTreeController', () => {
  beforeEach(async () => {
    await createTestApp({
      entities: [TreeNode, TreeNodeWithContent],
      metadata: {
        controllers: [ContentTreeController],
        providers: [ContentTreeService, TreeNodeRepository, TreeNodeWithContentRepository],
      },
      overrides: (builder) =>
        builder
          .overrideGuard(JwtAuthGuard)
          .useValue({ canActivate: () => true })
          .overrideGuard(RolesGuard)
          .useValue({ canActivate: () => true }),
    });
  });

  describe('CreateAndDeleteNode', () => {
    it('should create and delete tree', async () => {
      const rootNode = await createTreeNode('dummy name 1 ', 'dummy content', null);
      const childNode = await createTreeNode('dummy name 2', 'dummy content 2', rootNode.id);
      const grandchildNode = await createTreeNode('dummy name 3', 'dummy content 3', childNode.id);
      await createTreeNode('dummy name 4', 'dummy content 4', grandchildNode.id);
      const childNode2 = await createTreeNode('dummy name 5', 'dummy content 5', rootNode.id);

      await request(getTestApp().getHttpServer()).delete(`/api/tree/${childNode.id}`).expect(200);

      const allNodes = await getAllTreeNodes();
      const ids = allNodes.map((node: any) => node.id);
      expect(ids).toContain(rootNode.id);
      expect(ids).toContain(childNode2.id);
      expect(ids).not.toContain(childNode.id);
    });
  });

  describe('UpdateNodeAndGetContent', () => {
    it('should update existing node', async () => {
      const node = await createTreeNode('Original Name', 'Original Content', null);

      await request(getTestApp().getHttpServer())
        .post('/api/tree')
        .send({
          id: node.id,
          name: 'Updated Name',
          content: 'Updated Content',
        })
        .expect(201);

      const allNodes = await getAllTreeNodes();
      const names = allNodes.map((node: any) => node.name);
      expect(names).toContain('Updated Name');

      const contentResponse = await request(getTestApp().getHttpServer())
        .get(`/api/tree/content/${node.id}`)
        .expect(200);

      expect(contentResponse.body.content).toBe('Updated Content');
    });
  });

  describe('FindNode', () => {
    it('should find nodes by content or name when matching', async () => {
      const node1 = await createTreeNode('Alpha', 'Root content', null);
      await createTreeNode('Beta', 'Beta content', node1.id);
      const node3 = await createTreeNode('Gamma', 'Alpha content inside Gamma', node1.id);

      const response = await request(getTestApp().getHttpServer())
        .get('/api/tree/search')
        .query({ text: 'alpha' })
        .expect(200);

      expect(response.body).toEqual(expect.arrayContaining([node1.id, node3.id]));
    });

    it('should return empty list when not matching', async () => {
      const node1 = await createTreeNode('Alpha', 'Root content', null);
      await createTreeNode('Beta', 'Beta content', node1.id);
      await createTreeNode('Gamma', 'Alpha content inside Gamma', node1.id);

      const response = await request(getTestApp().getHttpServer())
        .get('/api/tree/search')
        .query({ text: 'NonExisting' })
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should find nodes using special characters', async () => {
      const node1 = await createTreeNode('Alpha', 'Non-matching content', null);
      await createTreeNode('Beta', 'first&second=third%20fourth(fifth[', node1.id);

      const response = await request(getTestApp().getHttpServer())
        .get('/api/tree/search')
        .query({ text: 'first&second=third%20fourth(fifth[' })
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe('MoveNode', () => {
    it('should move node successfully', async () => {
      const rootNode = await createTreeNode('dummy name', 'dummy content', null);
      const childNode = await createTreeNode('dummy name 2', 'dummy content 2', rootNode.id);
      const grandchildNode = await createTreeNode('dummy name 3', 'dummy content 3', childNode.id);

      await request(getTestApp().getHttpServer())
        .post('/api/tree/move')
        .query({
          nodeId: grandchildNode.id,
          newParentId: rootNode.id,
        })
        .expect(201);

      const allNodes = await getAllTreeNodes();
      const grandchild = allNodes.find((node: any) => node.id === grandchildNode.id);
      expect(grandchild.parentId).toBe(rootNode.id);
    });

    it('should return 400 when moving node to own descendant', async () => {
      const rootNode = await createTreeNode('dummy name', 'dummy content', null);
      const childNode = await createTreeNode('dummy name 2', 'dummy content 2', rootNode.id);
      const grandchildNode = await createTreeNode('dummy name 3', 'dummy content 3', childNode.id);
      const grandGrandchildNode = await createTreeNode(
        'dummy name 4',
        'dummy content 4',
        grandchildNode.id,
      );

      const response = await request(getTestApp().getHttpServer())
        .post('/api/tree/move')
        .query({
          nodeId: childNode.id,
          newParentId: grandGrandchildNode.id,
        })
        .expect(400);

      expect(response.body.message).toBe('Node cannot be moved into a descendant');
    });
  });
});

const createTreeNode = async (
  name: string,
  content: string,
  parentId: number | null,
): Promise<{ id: number; name: string; parentId: number | null }> => {
  const response = await request(getTestApp().getHttpServer())
    .put('/api/tree')
    .send({
      name,
      content,
      parentId,
    })
    .expect(200);

  return {
    id: Number(response.text),
    name,
    parentId,
  };
};

const getAllTreeNodes = async (): Promise<any[]> => {
  const response = await request(getTestApp().getHttpServer()).get('/api/tree').expect(200);

  return response.body;
};
