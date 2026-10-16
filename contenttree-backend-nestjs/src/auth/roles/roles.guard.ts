// roles/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLE_LEVELS } from '../model/role.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const implied = ROLE_LEVELS[user.role as Role];

    if (!implied.some((required) => requiredRoles.includes(required))) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
