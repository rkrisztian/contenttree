import type { LoginData } from "@/app/_lib/AuthContext";
import type { RemoteConfig } from "@/app/tree/_lib/remote-config";
import { LOGIN_RESP } from "./msw-mocks";

export const TEST_LOGIN_DATA = {
  ...LOGIN_RESP,
  username: "admin",
  role: "ADMIN",
} as LoginData;

export const TEST_REMOTE_CONFIG: Readonly<RemoteConfig> = {
  apiBaseUrl: process.env["API_BASE_URL"]!,
  company: {
    name: "Example Company",
    address: "Example Address",
    privacyEmail: "example@company.com",
    dataRetentionDays: 90,
  },
};
