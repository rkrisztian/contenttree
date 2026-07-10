import { utils } from 'vitest/browser';

// Show all DOM nodes (very helpful for debugging testing failures)
utils.configurePrettyDOM({
  maxDepth: Infinity,
  maxLength: Infinity,
  filterNode: 'script, style, [data-test-hide]',
});
