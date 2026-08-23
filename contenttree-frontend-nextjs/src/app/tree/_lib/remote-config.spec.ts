import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRemoteConfig } from "./remote-config";

describe("getRemoteConfig", () => {
  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "https://api.example.com");
    vi.stubEnv("COMPANY_NAME", "Acme Corp");
    vi.stubEnv("COMPANY_ADDRESS", "123 Main St");
    vi.stubEnv("COMPANY_PRIVACY_EMAIL", "privacy@acme.com");
    vi.stubEnv("COMPANY_DATA_RETENTION_DAYS", "30");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the configured values", async () => {
    const config = await getRemoteConfig();

    expect(config).toEqual({
      apiBaseUrl: "https://api.example.com",
      company: {
        name: "Acme Corp",
        address: "123 Main St",
        privacyEmail: "privacy@acme.com",
        dataRetentionDays: 30,
      },
    });
  });

  it.each([
    "API_BASE_URL",
    "COMPANY_NAME",
    "COMPANY_ADDRESS",
    "COMPANY_PRIVACY_EMAIL",
    "COMPANY_DATA_RETENTION_DAYS",
  ])("throws when %s is missing", async (varName) => {
    vi.stubEnv(varName, "");

    await expect(getRemoteConfig()).rejects.toThrow(new RegExp(varName));
  });
});
