/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('album', {
    id: { type: 'varchar', notNull: true, primaryKey: true },
    name: { type: 'varchar', notNull: true },
    year: { type: 'integer', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album');
};
