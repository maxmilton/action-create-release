const OFF = 0;
const WARN = 1;
const ERROR = 2;

// eslint-disable-next-line max-len
// /** @type {import('eslint').Linter.Config & { parserOptions: import('@typescript-eslint/types').ParserOptions }} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['/dist/'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.mjs', '.cjs'],
    project: ['./test/tsconfig.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:unicorn/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': ERROR,
    '@typescript-eslint/no-use-before-define': WARN,
    'import/extensions': WARN,
    'import/prefer-default-export': OFF,
    'no-plusplus': OFF,
    'no-restricted-syntax': OFF,
    'no-void': OFF,
    'unicorn/filename-case': OFF,
    'unicorn/no-abusive-eslint-disable': WARN,
    'unicorn/no-null': OFF,
    'unicorn/prefer-add-event-listener': OFF,
    'unicorn/prefer-dom-node-append': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/prefer-node-protocol': OFF,
    'unicorn/prefer-query-selector': OFF,
    'unicorn/prevent-abbreviations': OFF,
  },
};
