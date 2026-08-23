"use server";

import { cache } from "react";

export interface RemoteConfig {
  apiBaseUrl: string;
  company: {
    name: string;
    address: string;
    privacyEmail: string;
    dataRetentionDays: number;
  };
}

class MissingEnvVarError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing required environment variables: ${missing.join(", ")}`);
    this.name = "MissingEnvError";
  }
}

const readRemoteConfig = (): RemoteConfig => {
  const missingEnvVars = [
    "API_BASE_URL",
    "COMPANY_NAME",
    "COMPANY_ADDRESS",
    "COMPANY_PRIVACY_EMAIL",
    "COMPANY_DATA_RETENTION_DAYS",
  ].filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length) {
    throw new MissingEnvVarError(missingEnvVars);
  }

  return {
    apiBaseUrl: process.env["API_BASE_URL"]!,
    company: {
      name: process.env["COMPANY_NAME"]!,
      address: process.env["COMPANY_ADDRESS"]!,
      privacyEmail: process.env["COMPANY_PRIVACY_EMAIL"]!,
      dataRetentionDays: Number(process.env["COMPANY_DATA_RETENTION_DAYS"]!),
    },
  };
};

export const getRemoteConfig = cache(async () => readRemoteConfig());
