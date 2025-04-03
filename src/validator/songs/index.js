import BadRequestError from '../../exceptions/BadRequestError.js';
import SongPayloadSchema from './schema.js';

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

export default SongValidator;
