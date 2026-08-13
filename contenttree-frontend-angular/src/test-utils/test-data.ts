import { LoginData } from '@/app/core/auth/auth.service';
import { LOGIN_RESP } from './msw-mocks';

export const LOGIN_DATA = {
  ...LOGIN_RESP,
  username: 'admin',
  role: 'ADMIN',
} as LoginData;
