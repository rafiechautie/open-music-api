import autoBind from 'auto-bind';

import { successResponse } from '../../utils/responseFormatter.js';

class PlaylistsHandler {
  constructor(playlistService, songService, validator) {
    this._service = playlistService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    return successResponse(h, {
      status: 'success',
      data: { playlistId },
      message: 'Playlist berhasil ditambahkan',
      code: 201,
    });
  }

  async getUserPlaylist(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getAllUserPlaylist({ owner: credentialId });

    return successResponse(h, {
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  async deleteUserPlaylist(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteUserPlaylist(playlistId);

    return successResponse(h, {
      status: 'success',
      message: 'Playlistmu berhasil dihapus',
    });
  }

  async addSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._songService.getSongById(songId);
    const songOnPlaylistId = await this._service.addSongToPlaylist(playlistId, songId);

    return successResponse(h, {
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
      data: {
        songOnPlaylistId,
      },
      code: 201,
    });
  }

  async getAllSongOnPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._service.getPlaylistById(playlistId);
    const songs = await this._songService.getSongsOnPlaylist(playlistId);

    return successResponse(h, {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    });
  }

  async deleteSongOnPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongOnPlaylist(playlistId, songId);

    return successResponse(h, {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }
}

export default PlaylistsHandler;
