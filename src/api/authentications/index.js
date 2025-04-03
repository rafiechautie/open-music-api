import AuthenticationHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationService,
    usersService,
    tokenManager,
    validator,
  }) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationService,
      usersService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationHandler));
  },
};
