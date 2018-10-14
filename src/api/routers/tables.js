const express = require('express');
var pgp = require('pg-promise')();

const tablesRouter = express.Router();
var db = pgp('postgres://postgres:password@localhost:5432/postgres');

const items_query = 'SELECT * FROM item;';

tablesRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

tablesRouter.get('/table/:id', async (req, res) => {
  try {
    const data = await db.any(items_query, [true]);
    for (var i = 0; i < data.length; i++) {
      data[i]['details'] = {
        details: data[i]['details'],
        manufacturer: data[i]['manufacturer'],
        condition: data[i]['condition']
      };
      delete data[i]['manufacturer'];
      delete data[i]['condition'];
    }
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve items!');
  }
});

export default tablesRouter;
