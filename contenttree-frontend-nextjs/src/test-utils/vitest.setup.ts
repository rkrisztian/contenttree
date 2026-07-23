import { afterEach } from "node:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, beforeAll, expect, vi } from "vitest";

expect.extend(matchers);

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

beforeAll(() => {
  // Prevents race conditions (React states updates leaking across tests).
  // See issue: https://github.com/testing-library/react-testing-library/issues/1413
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Prevent race conditions (reset module cache so each test gets fresh provider/context instances).
  vi.resetModules();
});
