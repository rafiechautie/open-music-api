import Joi from 'joi';

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required(),
  albumId: Joi.string().optional(),
});

export default SongPayloadSchema;
