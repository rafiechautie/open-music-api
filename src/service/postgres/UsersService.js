import pkg from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import InternalServerError from '../../exceptions/InternalServerError.js';
import BadRequestError from '../../exceptions/BadRequestError.js';

const { Pool } = pkg;

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new BadRequestError('Gagal menambahkan user.');
      }
      return result.rows[0].id;
    } catch (error) {
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };
    try {
      const result = await this._pool.query(query);
      if (result.rows.length > 0) {
        throw new BadRequestError('Gagal menambahkan user. Username sudah digunakan.');
      }
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Terjadi kesalahan pada server');
    }
  }
}

export default UsersService;
