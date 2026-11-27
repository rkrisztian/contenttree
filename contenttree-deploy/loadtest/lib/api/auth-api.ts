import { check } from 'k6';
import http from 'k6/http';
import type { LoginReqDto, LoginRespDto } from '../../../api/schema';
import { BASE_URL } from '../constants.ts';

const BASE_PATH = 'api/auth';

export class AuthApi {
  readonly login = (credentials: LoginReqDto) => {
    const res = http.post(`${BASE_URL}/${BASE_PATH}/login`, JSON.stringify(credentials), {
      headers: { 'Content-Type': 'application/json' },
    });
    const success = check(res, { 'status is 2xx': (r) => r.status >= 200 && r.status < 300 });
    return success ? (res.json() as LoginRespDto) : undefined;
  };
}
