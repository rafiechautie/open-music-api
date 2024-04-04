/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('album', {
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.addColumn('album', {
    updatedAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('album', 'createdAt');
  pgm.dropColumn('album', 'updatedAt');
};
