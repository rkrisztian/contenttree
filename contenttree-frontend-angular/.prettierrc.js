import * as prettierPluginYuku from '@prettier/plugin-yuku';

/**
 * @type {import("prettier").Config}
 */
export default {
  plugins: [prettierPluginYuku],
  printWidth: 100,
  singleQuote: true,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
