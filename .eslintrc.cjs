/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['prettier', '@typescript-eslint', '@stylistic/ts', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Import
    'import/no-default-export': 'warn',

    // Stylistic — mandatory blank lines
    '@stylistic/ts/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'interface',
          'type',
          'return',
          'function',
          'if',
          'block-like',
          'class',
          'for',
          'while',
        ],
      },
      {
        blankLine: 'always',
        prev: [
          'interface',
          'type',
          'return',
          'function',
          'if',
          'block-like',
          'class',
          'for',
          'while',
        ],
        next: '*',
      },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],

    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/require-explicit-emits': 'warn',
    'vue/html-self-closing': [
      'error',
      {
        html: { void: 'always', normal: 'any', component: 'any' },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/max-attributes-per-line': [
      2,
      { singleline: 20, multiline: { max: 1 } },
    ],
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attribute-hyphenation': 'off',

    // General
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  overrides: [
    {
      files: ['vite.config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
