class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
    this.isClientError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ClientError;
