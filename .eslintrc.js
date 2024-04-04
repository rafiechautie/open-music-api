module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 15,
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'no-underscore-dangle': ['error', { allow: ['_notes', '_service', '_validator', '_pool'] }],
    camelcase: ['error', { allow: ['^created_at$', '^updated_at$'] }],
    'no-console': 'off',
  },
};
