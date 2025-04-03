import BadRequestError from '../../exceptions/BadRequestError.js';
import AlbumPayloadSchema from './schema.js';

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

export default AlbumValidator;
