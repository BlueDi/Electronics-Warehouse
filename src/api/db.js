var pgp = require('pg-promise')();

const cn = {
  host: 'database',
  port: 5432,
  database: 'ldso',
  user: 'postgres',
  password: 'postgres'
};

const db = pgp(cn);

module.exports = db;
