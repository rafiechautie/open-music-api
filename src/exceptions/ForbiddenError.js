import ClientError from './ClientError.js';
import { FORBIDDEN } from '../utils/constants.js';

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
