import pkg from 'pg';
import bcrypt from 'bcrypt';
import InternalServerError from '../../exceptions/InternalServerError.js';
import UnauthorizedError from '../../exceptions/UnauthorizedError.js';
import ForbiddenError from '../../exceptions/ForbiddenError.js';
import BadRequestError from '../../exceptions/BadRequestError.js';

const { Pool } = pkg;

class AuthenticationService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token, userId) {
    const query = {
      text: 'INSERT INTO refresh_tokens (token, user_id) VALUES($1, $2)',
      values: [token, userId],
    };
    try {
      await this._pool.query(query);
    } catch (error) {
      throw new InternalServerError('Internal Server Error');
    }
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM refresh_tokens WHERE token = $1',
      values: [token],
    };
    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new BadRequestError('Refresh token tidak valid');
      }
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    try {
      await this._pool.query(query);
    } catch (error) {
      throw new InternalServerError('Internal server error');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new UnauthorizedError('Kredensial yang anda berikan salah');
      }
      const { id: userId, password: hashedPassword } = result.rows[0];
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        throw new UnauthorizedError('Kredensial yang anda berikan salah');
      }
      return userId;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new InternalServerError('gagal mendapatkan username karena kesalahan sistem');
    }
  }
}

export default AuthenticationService;
