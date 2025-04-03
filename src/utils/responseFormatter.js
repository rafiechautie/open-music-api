const successResponse = (h, { message = '', data = {}, code = 200 }) => {
  const response = h.response({
    status: 'success',
    message,
    data,
  });

  response.code(code);
  return response;
};

export {
  successResponse,
};
