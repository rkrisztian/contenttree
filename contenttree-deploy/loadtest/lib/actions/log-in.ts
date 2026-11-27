import { AuthApi } from '../api/auth-api.ts';
import { ADMIN_PASSWORD } from '../constants.ts';

export const logIn = () => new AuthApi().login({ username: 'admin', password: ADMIN_PASSWORD });
