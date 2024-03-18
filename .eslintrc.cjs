const OFF = 0;
const WARN = 1;
const ERROR = 2;

/** @type {import('eslint/lib/shared/types').ConfigData & { parserOptions: import('@typescript-eslint/types').ParserOptions }} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['/index.mjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
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
    'unicorn/prevent-abbreviations': OFF,

    /* Covered by biome formatter */
    '@typescript-eslint/indent': OFF,
    'function-paren-newline': OFF,
    'implicit-arrow-linebreak': OFF,
    'max-len': OFF,
    'object-curly-newline': OFF,
    'operator-linebreak': OFF,
    'unicorn/no-nested-ternary': OFF,
  },
};
