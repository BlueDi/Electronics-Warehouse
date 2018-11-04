var pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'ldso',
  user: 'postgres',
  password: 'password'
};

const db = pgp(cn);

module.exports = db;
