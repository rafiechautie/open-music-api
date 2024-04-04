require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');
const ClientError = require('./exceptions/ClientError');
const albums = require('./api/albums');

const init = async () => {
  const albumsService = new AlbumService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      console.log('ClientError detected');
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
