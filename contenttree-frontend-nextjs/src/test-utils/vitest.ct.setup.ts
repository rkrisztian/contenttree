import { beforeEach } from "vitest";
import { utils } from "vitest/browser";
import { cleanup } from "vitest-browser-react/pure";

// Show all DOM nodes (very helpful for debugging testing failures)
utils.configurePrettyDOM({
  maxDepth: Infinity,
  maxLength: Infinity,
  filterNode: "script, style, [data-test-hide]",
});

beforeEach(async () => {
  await cleanup();
});
