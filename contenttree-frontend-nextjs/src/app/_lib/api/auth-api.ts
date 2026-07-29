import type { AxiosInstance } from "axios";
import type { RefObject } from "react";
import type { LoginReqDto, LoginRespDto } from "./types";

export const AUTH_API_BASE_PATH = "/api/auth";

export class AuthApi {
  constructor(private readonly backendApiRef: RefObject<AxiosInstance>) {}

  readonly login = async (credentials: LoginReqDto) =>
    (await this.getBackendApi().post<LoginRespDto>(`${AUTH_API_BASE_PATH}/login`, credentials))
      .data;

  private readonly getBackendApi = () => this.backendApiRef.current;
}
