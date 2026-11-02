import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller.js';
import { AuthService } from './auth/auth.service.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { HealthController } from './health.controller.js';
import { ContentTreeController } from './tree/content-tree.controller.js';
import { ContentTreeService } from './tree/content-tree.service.js';

@Module({
  controllers: [HealthController, ContentTreeController, AuthController],
  providers: [
    {
      provide: ContentTreeService,
      useValue: {},
    },
    {
      provide: AuthService,
      useValue: {},
    },
    JwtAuthGuard,
  ],
})
export class AppForDocsModule {}
