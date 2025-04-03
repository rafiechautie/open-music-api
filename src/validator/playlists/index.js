import BadRequestError from '../../exceptions/BadRequestError.js';
import { PlaylistSongsPayloadSchema, PlaylistsPayloadSchema } from './schema.js';

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },

  validatePlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
