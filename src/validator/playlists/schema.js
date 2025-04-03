import Joi from 'joi';

const PlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export {
  PlaylistSongsPayloadSchema,
  PlaylistsPayloadSchema,
};
