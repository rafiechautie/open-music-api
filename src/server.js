import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import pino from 'hapi-pino';

import ClientError from './exceptions/ClientError.js';

// Albums
import albums from './api/albums/index.js';
import AlbumService from './service/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';

// Songs
import songs from './api/songs/index.js';
import SongService from './service/postgres/SongService.js';
import SongValidator from './validator/songs/index.js';

// Authentications
import authentications from './api/authentications/index.js';
import AuthenticationService from './service/postgres/AuthenticationService.js';
import TokenManager from './tokenize/TokenManager.js';
import AuthenticationsValidator from './validator/authentications/index.js';

// Users
import UsersService from './service/postgres/UsersService.js';

// playlists
import playlists from './api/playlists/index.js';
import PlaylistService from './service/postgres/PlaylistService.js';
import PlaylistsValidator from './validator/playlists/index.js';

dotenv.config();

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const authenticationService = new AuthenticationService();
  const usersService = new UsersService();
  const playlistService = new PlaylistService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: pino,
      options: {
        transport: process.env.NODE_ENV !== 'production'
          ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname,req.headers,res.headers',
            },
          }
          : undefined,
        logEvents: ['onPostStart', 'onPostStop', 'request-error'],
        level: 'info',
        redact: ['req.headers.authorization'],
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService,
        songService,
        validator: PlaylistsValidator,
      },
    },
  ]);
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      let newResponse;
      if (response instanceof ClientError) {
        newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
      } else if (response?.output?.statusCode === 401) {
        const customMessage = 'Sesi anda telah kadaluarsa, silahkan login kembali.';
        newResponse = h.response({
          status: 'error',
          message: customMessage,
        });
        newResponse.code(401);
      } else {
        request.logger?.error?.(response);
        newResponse = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        newResponse.code(500);
      }

      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
