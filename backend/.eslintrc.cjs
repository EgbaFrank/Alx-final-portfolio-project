module.exports = {
  env: {
    browser: false,
    node: true,  // Enable Node.js globals like process, module
    es6: true,   // Enable ES6 syntax
    jest: true,  // Enable Jest environment if you're using Jest for tests
  },
  extends: [
    'airbnb-base',
    'plugin:jest/all',  // Includes Jest linting rules if you're using Jest for testing
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,    // Enable parsing of modern JavaScript syntax
    sourceType: 'module', // Enable ES modules (import/export)
  },
  plugins: ['jest'],  // Jest plugin for linting tests
  rules: {
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement',
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'always',
        'jsx': 'always',
      }
    ]
  },
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: 'babel.config.js',  // Exclude certain files like Babel config
    },
  ],
};
