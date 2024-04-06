const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantErrors');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs values($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0].song_id;
    } catch (error) {
      throw new InvariantError('Album gagal ditambahkan');
    }
  }

  async getSongs({ title, performer }) {
    let queryText = 'SELECT song_id, title, performer FROM songs';
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
      // kembaliannya berupa array sehingga harus di mapping
      const result = await this._pool.query(query);

      const mappedSongs = result.rows.map((song) => ({
        id: song.song_id,
        title: song.title,
        performer: song.performer,
      }));
      return mappedSongs;
    } catch (error) {
      throw new Error('Gagal mendapatkan lagu karena kesalahan sistem');
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [id],
    };
    try {
      const result = await this._pool.query(query);
      if (result.rows.length === 0) {
        throw new NotFoundError(`Lagu dengan ID ${id} tidak ditemukan`);
      }
      const song = result.rows[0];
      return {
        id: song.song_id,
        title: song.title,
        year: song.year,
        performer: song.performer,
        genre: song.genre,
        duration: song.duration,
        albumId: song.album_id,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Gagal mendapatkan album dengan ID ${id} karena kesalahan sistem`);
    }
  }

  async putSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, "updatedAt" = $7 WHERE song_id = $8 RETURNING song_id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Gagal memperbarui lagu. ID tidak ditemukan');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Gagal memperbarui lagu karena kesalahan server');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Lagu gagal ditambahkan, song_id tidak ditemukan');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Gagagl menghapus lagu karena kesalahan sistem');
    }
  }
}

module.exports = SongService;
