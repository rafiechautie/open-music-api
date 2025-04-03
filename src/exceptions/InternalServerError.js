import ClientError from './ClientError.js';
import { INTERNAL_SERVER_ERROR } from '../utils/constants.js';

class InternalServerError extends ClientError {
  constructor(message) {
    super(message, INTERNAL_SERVER_ERROR);
    this.name = 'Internal Server Error';
  }
}

export default InternalServerError;
