/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('album', 'id', 'album_id');
};

exports.down = (pgm) => {
  pgm.renameColumn('album', 'album_id', 'id');
};
