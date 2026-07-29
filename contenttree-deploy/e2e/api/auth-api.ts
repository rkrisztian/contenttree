import { APIRequestContext } from '@playwright/test';
import { LoginReqDto } from './types/models/LoginReqDto.js';
import { LoginRespDto } from './types/models/LoginRespDto.js';

export const login = async (request: APIRequestContext, username: string, password: string) => {
  const loginResponse = await request.post('/api/auth/login', {
    data: { username, password } as LoginReqDto,
  });

  if (!loginResponse.ok()) {
    throw new Error(`Failed to login: ${await loginResponse.text()}`);
  }

  const loginData = (await loginResponse.json()) as LoginRespDto;

  if (!loginData.token) {
    throw new Error('Token not found in login response');
  }

  return {
    Authorization: `Bearer ${loginData.token}`,
  };
};
