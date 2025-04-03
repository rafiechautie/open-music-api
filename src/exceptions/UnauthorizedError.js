import ClientError from './ClientError.js';
import { UNAUTHORIZED } from '../utils/constants.js';

class UnauthorizedError extends ClientError {
  constructor(message) {
    super(message, UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
