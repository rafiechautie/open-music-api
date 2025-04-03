import ClientError from './ClientError.js';
import { BAD_REQUEST } from '../utils/constants.js';

class BadRequestError extends ClientError {
  constructor(message) {
    super(message, BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}
export default BadRequestError;
