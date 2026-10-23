import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, getTestApp } from '../test-utils/test-postgres.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { Role } from './model/role.js';
import { User } from './model/user.entity.js';
import { UserRepository } from './user.repository.js';

describe('AuthController', () => {
  beforeEach(async () => {
    await createTestApp({
      entities: [User],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserRepository,
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn().mockResolvedValue('mock-jwt-token'),
          },
        },
      ],
    });
  });

  describe('shouldAllowAccessingProtectedEndpointAfterLogin', () => {
    it('should allow access to protected endpoint after successful login', async () => {
      await getTestApp()
        .get(UserRepository)
        .save(new User('testUserForLogin', await bcrypt.hash('secret', 10), Role.ADMIN));

      const token = (
        await request(getTestApp().getHttpServer())
          .post('/api/auth/login')
          .send({
            username: 'testUserForLogin',
            password: 'secret',
          })
          .expect(200)
      ).body.token;

      expect(token).toBe('mock-jwt-token');
    });
  });
});
