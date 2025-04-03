import pkg from 'pg';
import { nanoid } from 'nanoid';
import InternalServerError from '../../exceptions/InternalServerError.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pkg;

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new BadRequestError('Lagu gagal ditambahkan');
      }
      return result.rows[0].id;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getAllSongs(title, performer) {
    let queryText = 'SELECT id, title, performer FROM songs';
    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`performer ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const query = {
      text: queryText,
      values,
    };
    try {
      const result = await this._pool.query(query);
      return result.rows;
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer,genre, duration FROM songs WHERE id = $1',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async updateSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
      }
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
      SELECT s.id, s.title, s.performer
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.id
      WHERE ps.playlist_id = $1
    `,
      values: [playlistId],
    };
    try {
      const result = await this._pool.query(query);
      return result.rows;
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }
}

export default SongService;
