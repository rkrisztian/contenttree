export enum Role {
  READER = 'READER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export const ROLE_LEVELS: Record<Role, Role[]> = {
  [Role.READER]: [Role.READER],
  [Role.MANAGER]: [Role.MANAGER, Role.READER],
  [Role.ADMIN]: [Role.ADMIN, Role.MANAGER, Role.READER],
};
