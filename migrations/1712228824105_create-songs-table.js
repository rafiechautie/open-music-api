/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    createdAt: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
