import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import type { ErrorData } from "@/app/_lib/BackendApiContext";
import appMessages from "@/i18n/messages/en/app.json";
import { it } from "@/test-utils/msw-ct";
import { t, WithTestI18nProvider } from "@/test-utils/test-i18n";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import { ErrorCard } from "./ErrorCard";

describe("ErrorService", () => {
  const copyButton = () =>
    page.getByRole("button", { name: t("app.error-card.copy-button-aria-label"), exact: true });

  beforeEach(async () => {
    await render(
      <WithTestI18nProvider namespace="app" messages={appMessages}>
        <WithBackendApiContextProvider>
          <ErrorCard
            error={
              {
                id: "1",
                error: "dummy error",
                message: "dummy message",
                traceId: "abcd-1234",
              } satisfies ErrorData
            }
          />
        </WithBackendApiContextProvider>
        ,
      </WithTestI18nProvider>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should copy error data to clipboard", async () => {
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockImplementation(async () => {});

    await copyButton().click();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(expect.stringContaining("abcd-1234"));
  });
});
