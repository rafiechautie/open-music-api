import ClientError from './ClientError.js';
import { NOT_FOUND } from '../utils/constants.js';

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
