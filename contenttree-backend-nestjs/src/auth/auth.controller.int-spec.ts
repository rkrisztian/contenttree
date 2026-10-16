import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModuleOptions, PassportModule } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { createTestApp, getTestApp } from '../test-utils/test-postgres.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { JwtStrategy } from './jwt.strategy.js';
import { Role } from './model/role.js';
import { User } from './model/user.entity.js';
import { Roles } from './roles/roles.decorator.js';
import { RolesGuard } from './roles/roles.guard.js';
import { UserRepository } from './user.repository.js';

describe('AuthController', () => {
  beforeEach(async () => {
    await createTestApp({
      entities: [User],
      metadata: {
        imports: [
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
          }),
        ],
        controllers: [AuthController, TestController],
        providers: [
          AuthService,
          JwtStrategy,
          {
            provide: ConfigService,
            useValue: {
              getOrThrow: (key: string) => {
                if (key === 'JWT_SECRET') return process.env.JWT_SECRET;
                throw new Error(`Unexpected key: ${key}`);
              },
            },
          },
          UserRepository,
          JwtAuthGuard,
          AuthModuleOptions,
        ],
        exports: [JwtAuthGuard, AuthModuleOptions],
      },
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

      await request(getTestApp().getHttpServer())
        .get('/api/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/test')
class TestController {
  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.MANAGER)
  ping() {
    return { status: 'ok' };
  }
}
