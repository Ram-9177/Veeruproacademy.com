module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  globals: {
    React: 'readonly',
  },
  ignorePatterns: ['**/node_modules/**', '**/.next/**', '**/tests/assets/axe.min.js', '**/scripts/**'],
  rules: {
    // TypeScript handles prop types
    'react/prop-types': 'off',
    // allow some unescaped entities in content
    // prefer TypeScript to report unused vars; enforce but allow leading underscore for ignored args
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    // surface unescaped-entity issues so we can fix literal text containing <, >, etc.
    'react/no-unescaped-entities': ['warn', { 'forbid': ['>', '}', "'", '"'] }],
    // prefer Next.js Image component; warn where <img> is used
    '@next/next/no-img-element': 'warn',
    // internal anchors to pages are used in this static site; keep relaxed for now
    '@next/next/no-html-link-for-pages': 'off',
    // allow components without displayName (tests and inline wrappers)
    'react/display-name': 'off',
    // allow lexical declarations in case blocks
    'no-case-declarations': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.{ts,tsx,js}'],
      env: { jest: true },
      globals: { jest: 'readonly', test: 'readonly', expect: 'readonly' },
      rules: {
        // tests can freely use jsdom globals
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // TypeScript takes care of no-undef
        'no-undef': 'off',
      },
    },
  ],
}
