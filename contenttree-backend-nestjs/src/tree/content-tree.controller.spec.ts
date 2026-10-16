import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles/roles.guard.js';
import { ContentTreeController } from './content-tree.controller.js';
import { ContentTreeService } from './content-tree.service.js';
import { MoveNodeException } from './exception/move-node.exception.js';
import { NodeNotFoundException } from './exception/node-not-found.exception.js';
import { ParentNodeNotFoundException } from './exception/parent-node-not-found.exception.js';

/* oxlint-disable unbound-method */
describe('ContentTreeController', () => {
  let service: ContentTreeService;
  let app: INestApplication;

  beforeEach(async () => {
    const mockService = {
      deleteNode: vi.fn(),
      getContentById: vi.fn(),
      moveNode: vi.fn(),
      findText: vi.fn(),
      getTree: vi.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ContentTreeController],
      providers: [
        {
          provide: ContentTreeService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    service = moduleFixture.get<ContentTreeService>(ContentTreeService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('DeleteNode', () => {
    it('should return 404 when deleting non-existent node', async () => {
      vi.mocked(service.deleteNode).mockRejectedValue(new NodeNotFoundException());

      await request(app.getHttpServer()).delete('/api/tree/1').expect(404);
    });
  });

  describe('GetContent', () => {
    it('should return 404 when loading content of non-existent node', async () => {
      vi.mocked(service.getContentById).mockRejectedValue(new NodeNotFoundException());

      await request(app.getHttpServer()).get('/api/tree/content/1').expect(404);
    });
  });

  describe('MoveNode', () => {
    it('should return 400 when service throws validation exception', async () => {
      vi.mocked(service.moveNode).mockRejectedValue(new MoveNodeException('Dummy text'));

      await request(app.getHttpServer())
        .post('/api/tree/move')
        .send({ nodeId: 1, newParentId: 1 })
        .expect(400);
    });

    it('should return 404 when moving node to non-existent parent', async () => {
      vi.mocked(service.moveNode).mockRejectedValue(new ParentNodeNotFoundException());

      await request(app.getHttpServer())
        .post('/api/tree/move')
        .send({ nodeId: 1, newParentId: 1 })
        .expect(404);
    });
  });

  describe('Authorization', () => {
    it('should return 403 when searching without READER role', async () => {
      // Create a new module without bypassing the RolesGuard
      const mockService = {
        findText: vi.fn(),
      };

      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [ContentTreeController],
        providers: [
          {
            provide: ContentTreeService,
            useValue: mockService,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

      const appWithRoles = moduleFixture.createNestApplication();
      await appWithRoles.init();

      const response = await request(appWithRoles.getHttpServer())
        .get('/api/tree/search')
        .query({ text: 'text' })
        .expect(403);

      expect(response.status).toBe(403);
      await appWithRoles.close();
    });

    it('should return 403 when deleting without MANAGER role', async () => {
      const mockService = {
        deleteNode: vi.fn(),
      };

      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [ContentTreeController],
        providers: [
          {
            provide: ContentTreeService,
            useValue: mockService,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

      const appWithRoles = moduleFixture.createNestApplication();
      await appWithRoles.init();

      const response = await request(appWithRoles.getHttpServer())
        .delete('/api/tree/1')
        .expect(403);

      expect(response.status).toBe(403);
      await appWithRoles.close();
    });

    it('should return 200 when deleting with ADMIN role', async () => {
      const response = await request(app.getHttpServer()).delete('/api/tree/1').expect(200);

      expect(response.status).toBe(200);
    });
  });
});
