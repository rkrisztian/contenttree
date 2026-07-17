import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react/pure";
import type { ErrorData } from "@/app/_lib/BackendApiContext";
import { it } from "@/test-utils/msw-ct";
import { WithBackendApiContextProvider } from "@/test-utils/test-providers";
import { ErrorCard } from "./ErrorCard";

describe("ErrorService", () => {
  beforeEach(async () => {
    await render(
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
      </WithBackendApiContextProvider>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should copy error data to clipboard", async () => {
    const clipboardWriteTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockImplementation(async () => {});

    await page.getByRole("button", { name: "Copy error data", exact: true }).click();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(expect.stringContaining("abcd-1234"));
  });
});
