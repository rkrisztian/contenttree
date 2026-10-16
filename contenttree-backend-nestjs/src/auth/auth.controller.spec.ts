import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

/* oxlint-disable unbound-method */
describe('AuthController', () => {
  let service: AuthService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: vi.fn(),
          },
        },
      ],
    }).compile();

    service = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Login', () => {
    it('should return 401 when credentials are invalid', async () => {
      vi.mocked(service.authenticate).mockRejectedValue(
        new UnauthorizedException('Bad credentials'),
      );

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testUser', password: 'wrongPassword' })
        .expect(401);
    });

    it('should return 200 when login is successful', async () => {
      vi.mocked(service.authenticate).mockResolvedValue('valid-token');

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testUser', password: 'correctPassword' })
        .expect(200);

      expect(response.body.token).toBe('valid-token');
    });
  });
});
