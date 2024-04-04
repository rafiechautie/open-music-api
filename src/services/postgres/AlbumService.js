const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantErrors');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO album values($1, $2, $3, $4, $5) RETURNING album_id',
      values: [id, name, year, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0].album_id;
    } catch (error) {
      throw new InvariantError('Album gagal ditambahkan');
    }
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE album_id = $1',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (result.rows.length === 0) {
        throw new NotFoundError(`Album dengan ID ${id} tidak ditemukan`);
      }
      const album = result.rows[0];
      return {
        id: album.album_id,
        name: album.name,
        year: album.year,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Gagal mendapatkan album dengan ID ${id} karena kesalahan sistem`);
    }
  }

  async putAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    // "updatedAt"
    /**
     * Di PostgreSQL, penanganan identifier seperti nama kolom dan tabel case-sensitive,
     * tapi ada aturan khusus yang berlaku. Saat  membuat kolom atau tabel tanpa mengutip
     * nama kolom, PostgreSQL akan secara otomatis mengubah nama tersebut menjadi lowercase.
     * Ini berarti jika saya membuat sebuah kolom dengan nama UpdatedAt tanpa mengutipnya,
     * PostgreSQL akan menyimpan nama kolom tersebut sebagai updatedat.
     */
    const query = {
      text: 'UPDATE album SET name = $1, year = $2, "updatedAt" = $3 WHERE album_id = $4 RETURNING album_id',
      values: [name, year, updatedAt, id],
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
      text: 'DELETE FROM album WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Album gagal ditambahkan. album_id tidak ditemukan');
      }
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Gagal menghapus album karena kesalahan server');
    }
  }
}

module.exports = AlbumService;
