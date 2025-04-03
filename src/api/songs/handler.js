import autoBind from 'auto-bind';
import { successResponse } from '../../utils/responseFormatter.js';

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    return successResponse(h, {
      status: 'success',
      data: { songId },
      message: 'Lagu berhasil ditambahkan',
      code: 201,
    });
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getAllSongs(title, performer);
    return successResponse(h, {
      status: 'success',
      data: { songs },
    });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return successResponse(h, {
      status: 'success',
      data: {
        song,
      },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.updateSongById(id, request.payload);

    return successResponse(h, {
      status: 'succes',
      message: 'Lagu berhasil diperbarui',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return successResponse(h, {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
  }
}

export default SongHandler;
