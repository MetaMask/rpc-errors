module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  plugins: [
    'json',
  ],
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/nodejs',
  ],
  ignorePatterns: [
    '!.eslintrc.js',
    'node_modules/',
  ],
}
