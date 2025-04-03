import autoBind from 'auto-bind';

import { successResponse } from '../../utils/responseFormatter.js';

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    return successResponse(h, {
      message: 'Album berhasil ditambahkan',
      data: { albumId },
      code: 201,
    });
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return successResponse(h, {
      status: 'success',
      data: { album },
    });
  }

  async updateAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.editAlbumById(id, { name, year });

    return successResponse(h, {
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return successResponse(h, {
      status: 'success',
      message: 'Album berhasil dihapus',
    });
  }
}

export default AlbumHandler;
