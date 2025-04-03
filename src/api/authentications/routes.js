const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postLoginUserHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAcessTokenHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
  },
  {
    method: 'POST',
    path: '/users',
    handler: handler.registerUserHandler,
  },
];
export default routes;
