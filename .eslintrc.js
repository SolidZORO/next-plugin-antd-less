module.exports = {
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
  ],
  globals: {
    __DEV__: true,
    __PROD__: true,
    status: false,
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    semi: ['error', 'always'],
    'max-len': [2, 120],
    'no-console': 'off',
    'no-var-requires': 'off',
    'no-underscore-dangle': ['error', { allow: ['__DEV__', '__PROD__', '_insertCss'] }],
    //
    'dot-notation': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    'lines-between-class-members': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'no-prototype-builtins': 'off',
    'no-restricted-syntax': [
      'error',
      // 'ForOfStatement',
      // 'ForInStatement',
      'LabeledStatement',
      'FunctionExpression',
      'WithStatement',
      "BinaryExpression[operator='in']",
    ],
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
  },
};
