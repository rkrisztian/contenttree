import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { ErrorData } from "@/app/_lib/BackendApiContext";
import { it } from "@/test-utils/msw-ct";
import { WithTreePageContextProvider } from "@/test-utils/tree-page-provider";
import { ErrorCard } from "./ErrorCard";

describe("ErrorService", () => {
  beforeEach(async () => {
    await render(
      <WithTreePageContextProvider>
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
      </WithTreePageContextProvider>,
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
