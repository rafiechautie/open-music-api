const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getUserPlaylist,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deleteUserPlaylist,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.addSongToPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getAllSongOnPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongOnPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

export default routes;
