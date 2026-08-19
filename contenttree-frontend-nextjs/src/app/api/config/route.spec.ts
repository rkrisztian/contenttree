import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("GET /api/config", () => {
  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "https://api.example.com");
    vi.stubEnv("COMPANY_NAME", "Acme Corp");
    vi.stubEnv("COMPANY_ADDRESS", "123 Main St");
    vi.stubEnv("COMPANY_PRIVACY_EMAIL", "privacy@acme.com");
    vi.stubEnv("COMPANY_DATA_RETENTION_DAYS", "30");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns the configured values", async () => {
    const res = await GET();
    const body = await res.json();

    expect.soft(res.status).toBe(200);
    expect.soft(body).toEqual({
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
  ])("returns 500 when %s is missing", async (varName) => {
    vi.stubEnv(varName, "");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await GET();
    const body = await res.json();

    expect.soft(res.status).toBe(500);
    expect.soft(body.error).toBe("Configuration error");
    expect.soft(body.message).toContain(varName);
    expect.soft(consoleError).toHaveBeenCalled();
  });
});
