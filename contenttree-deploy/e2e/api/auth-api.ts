import { APIRequestContext } from '@playwright/test';
import { LoginReqDto, LoginRespDto } from '../../api/schema';

export const login = async (request: APIRequestContext, username: string, password: string) => {
  const loginResponse = await request.post<LoginRespDto>('/api/auth/login', {
    data: { username, password } as LoginReqDto,
  });

  if (!loginResponse.ok()) {
    throw new Error(`Failed to login: ${await loginResponse.text()}`);
  }

  const loginData = await loginResponse.json();

  if (!loginData.token) {
    throw new Error('Token not found in login response');
  }

  return {
    Authorization: `Bearer ${loginData.token}`,
  };
};
