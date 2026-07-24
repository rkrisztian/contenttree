import type { LoginData } from "@/app/_lib/AuthContext";
import { LOGIN_RESP } from "./msw-mocks";

export const LOGIN_DATA = {
  ...LOGIN_RESP,
  username: "admin",
  role: "ADMIN",
} as LoginData;
