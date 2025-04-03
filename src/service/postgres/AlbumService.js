import pkg from 'pg';
import { nanoid } from 'nanoid';
import BadRequestError from '../../exceptions/BadRequestError.js';
import InternalServerError from '../../exceptions/InternalServerError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pkg;

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new BadRequestError('Album gagal ditambahkan');
      }
      return result.rows[0].id;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    try {
      const resultAlbum = await this._pool.query(queryAlbum);
      if (resultAlbum.rows.length === 0) {
        throw new NotFoundError(`Album dengan ID ${id} tidak ditemukan`);
      }
      const album = resultAlbum.rows[0];

      const resultSongs = await this._pool.query(querySongs);
      const songs = resultSongs.rows;

      return {
        id: album.id,
        name: album.name,
        year: album.year,
        songs,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    try {
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Gagal memperbarui album. ID tidak ditemukan');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Gagal memperbarui album karena kesalahan server');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Album gagal ditambahkan. album_id tidak ditemukan');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Gagal menghapus album karena kesalahan server');
    }
  }
}

export default AlbumService;
