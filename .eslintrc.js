module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/nodejs',
    '@metamask/eslint-config/config/typescript',
  ],
  plugins: [
    'json',
  ],
  overrides: [{
    files: ['*.js', '*.json'],
    parserOptions: {
      sourceType: 'script',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  }],
  ignorePatterns: [
    '!.eslintrc.js',
    'coverage/',
    'dist/',
    'node_modules/',
  ],
};
