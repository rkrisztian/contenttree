import { NextResponse } from "next/server";

export interface RemoteConfig {
  apiBaseUrl: string;
}

export const REMOTE_CONFIG_PATH = "/api/config";

export const GET = async () => {
  if (!process.env["API_BASE_URL"]) {
    console.error(`Missing required environment variable: API_BASE_URL`);

    return NextResponse.json(
      {
        error: "Configuration error",
        message: `Missing required environment variables: API_BASE_URL`,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    apiBaseUrl: process.env["API_BASE_URL"],
  } as RemoteConfig);
};
