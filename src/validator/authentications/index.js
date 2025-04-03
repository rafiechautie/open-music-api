import BadRequestError from '../../exceptions/BadRequestError.js';
import { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema, UserPayloadSchema } from './schema.js';

const AuthenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

export default AuthenticationValidator;
