import type { AxiosInstance } from "axios";
import type { RefObject } from "react";
import type { components } from "@/app/_lib/schema";

export type LoginReqDto = components["schemas"]["LoginReqDto"];
export type LoginRespDto = components["schemas"]["LoginRespDto"];

export const AUTH_API_BASE_PATH = "/api/auth";

export class AuthApi {
  constructor(private readonly backendApiRef: RefObject<AxiosInstance>) {}

  readonly login = async (credentials: LoginReqDto) =>
    (await this.getBackendApi().post<LoginRespDto>(`${AUTH_API_BASE_PATH}/login`, credentials))
      .data;

  readonly logout = async () => {
    await this.getBackendApi().post<void>(`${AUTH_API_BASE_PATH}/logout`);
  };

  private readonly getBackendApi = () => this.backendApiRef.current;
}
