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
    'no-underscore-dangle': ['error', {
      allow: [
        '_notes', '_service', '_validator', '_pool',
        '_usersService', '_tokenManager', '_authenticationService',
        '_songService', '_collaborationsService', '_playlistsService',
        '_songsService', '_playlistHistoryService', '_logger',
      ],
    }],
    camelcase: ['error', { allow: ['^created_at$', '^updated_at$'] }],
    'no-console': 'off',
    'import/extensions': ['error', 'always', {
      js: 'always',
      json: 'always',
    }],
  },
};
