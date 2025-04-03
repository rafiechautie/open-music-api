import pkg from 'pg';
import { nanoid } from 'nanoid';
import InternalServerError from '../../exceptions/InternalServerError.js';
import ForbiddenError from '../../exceptions/ForbiddenError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pkg;

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING ID',
      values: [id, name, owner],
    };
    try {
      const result = await this._pool.query(query);
      if (!result.rows[0].id) {
        throw new NotFoundError('playlist gagal ditambahkan');
      }
      return result.rows[0].id;
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getAllUserPlaylist({ owner }) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner],
    };
    try {
      const result = await this._pool.query(query);
      return result.rows;
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async deleteUserPlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    try {
      const result = await this._pool.query(query);
      if (result.rowCount === 0) {
        throw new NotFoundError('Gagal menghapus playlists');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async verifyPlaylistOwner(playlistId, credentialId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      if (result.rows[0].owner !== credentialId) {
        throw new ForbiddenError('Anda tidak berhak mengakses resources ini');
      }
    } catch (error) {
      if (
        error instanceof NotFoundError
            || error instanceof ForbiddenError
      ) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    try {
      const result = await this._pool.query(query);
      if (!result.rows[0].id) {
        throw new NotFoundError('Lagu gagal ditambahkan ke dalam playlist');
      }
      return result.rows[0].id;
    } catch (error) {
      if (error instanceof NotFoundError) return error;
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getPlaylistById(playlistId) {
    try {
      const query = {
        text: `
          SELECT playlists.id, playlists.name, users.username
          FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          WHERE playlists.id = $1
        `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        username: row.username,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getSongsOnPlaylist(playlistId) {
    const query = {
      text: `
      SELECT s.song_id, s.title, s.performer
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.song_id
      WHERE ps.playlist_id = $1
    `,
      values: [playlistId],
    };
    try {
      const result = await this._pool.query(query);

      return result.rows.map((song) => ({
        id: song.song_id,
        title: song.title,
        performer: song.performer,
      }));
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async deleteSongOnPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
    try {
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Lagu gagal dihapus');
      }
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }
}

export default PlaylistService;
