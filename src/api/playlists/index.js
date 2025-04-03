import PlaylistsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistService,
    songService,
    validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistService,
      songService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};
