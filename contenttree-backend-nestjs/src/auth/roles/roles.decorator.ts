import { SetMetadata } from '@nestjs/common';
import { Role } from '../model/role.js';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
