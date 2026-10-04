// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    ignores: [
      'src/app/api/types/**',
      '.prettierrc.js',
      'eslint.config.js',
      'vitest.config.ts',
      'vitest.ct.config.ts',
      'dpdm.config.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
    },
  },
]);
