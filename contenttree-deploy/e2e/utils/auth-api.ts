import { APIRequestContext } from '@playwright/test';
import { components } from '../api/schema.js';

type LoginReqDto = components['schemas']['LoginReqDto'];
type LoginRespDto = components['schemas']['LoginRespDto'];

export const login = async (request: APIRequestContext, username: string, password: string) => {
  const loginResponse = await request.post(`/api/auth/login`, {
    data: { username, password } as LoginReqDto,
  });

  if (!loginResponse.ok()) {
    throw new Error(`Failed to login: ${await loginResponse.text()}`);
  }

  const loginData = (await loginResponse.json()) as LoginRespDto;
  const token = loginData.token;

  if (!token) {
    throw new Error('Token not found in login response');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
