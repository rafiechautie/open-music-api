/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('songs', 'album', 'album_id');

  pgm.alterColumn('songs', 'album_id', {
    notNull: false,
    type: 'VARCHAR(255)',
  });
};

exports.down = (pgm) => {
  // Mengembalikan kolom 'albumId' agar tidak memperbolehkan nilai NULL
  pgm.alterColumn('songs', 'album_id', {
    notNull: true,
    type: 'VARCHAR(255)',
  });
  // Mengembalikan nama kolom 'albumId' menjadi 'album'
  pgm.renameColumn('songs', 'album_id', 'album');
};
