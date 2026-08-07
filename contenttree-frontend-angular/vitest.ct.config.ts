import { mergeConfig, ViteUserConfig } from 'vitest/config';
import unitTestConfig from './vitest.config';

/**
 * Vitest config for component testing, consumed by Angular's `@angular/build:unit-test` builder
 * (with `runnerConfig: true`).
 *
 * The unit-test builder takes the `implicitBrowser` list obtained from the build's
 * `externalPackages: true` setting and inserts it directly into Vite's `optimizeDeps.include`,
 * while simultaneously adding the same packages to esbuild's external list. Since msw appears
 * on both sides, it causes "entry point 'msw' cannot be marked as external" errors during
 * prebundling. Because `exclude` alone does not remove entries from the include list, msw is
 * removed from the include array using `configResolved`.
 *
 * Reference: https://github.com/angular/angular-cli/issues/32523
 *
 * Workaround adapted from: https://github.com/lacolaco/angular-signal-forms-examples
 * Note: The original solution is used without an explicit license. Attribution
 * is provided here as a courtesy to the original author.
 */
export default mergeConfig(unitTestConfig, {
  optimizeDeps: {
    exclude: ['msw', 'msw/browser'],
  },
  plugins: [
    {
      name: 'strip-msw-from-optimize-deps-include',
      enforce: 'post',
      configResolved(config) {
        const include = config.optimizeDeps?.include;
        if (Array.isArray(include)) {
          const filtered = include.filter((id) => id !== 'msw' && id !== 'msw/browser');
          (config.optimizeDeps as { include: string[] }).include = filtered;
        }
      },
    },
  ],
  test: {
    coverage: {
      reportsDirectory: 'coverage-ct',
    },
  },
} as ViteUserConfig);
