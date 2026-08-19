import { NextResponse } from "next/server";

export interface RemoteConfig {
  apiBaseUrl: string;
  company: {
    name: string;
    address: string;
    privacyEmail: string;
    dataRetentionDays: number;
  };
}

export const REMOTE_CONFIG_PATH = "/api/config";

export const GET = async () => {
  for (const envVar of [
    "API_BASE_URL",
    "COMPANY_NAME",
    "COMPANY_ADDRESS",
    "COMPANY_PRIVACY_EMAIL",
    "COMPANY_DATA_RETENTION_DAYS",
  ]) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);

      return NextResponse.json(
        {
          error: "Configuration error",
          message: `Missing required environment variables: ${envVar}`,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    apiBaseUrl: process.env["API_BASE_URL"]!,
    company: {
      name: process.env["COMPANY_NAME"]!,
      address: process.env["COMPANY_ADDRESS"]!,
      privacyEmail: process.env["COMPANY_PRIVACY_EMAIL"]!,
      dataRetentionDays: Number(process.env["COMPANY_DATA_RETENTION_DAYS"]!),
    },
  } satisfies RemoteConfig);
};
