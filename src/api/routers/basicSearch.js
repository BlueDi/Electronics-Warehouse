const express = require('express');
const db = require('@api/db.js');

const basicSearchRouter = express.Router();

basicSearchRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

basicSearchRouter.get('/table/:id', async (req, res) => {
  var body = req.body;

  var query = `SELECT * FROM item WHERE name LIKE %'${body.searchInput}'%;`;

  try {
    const data = await db.any(query, [true]);
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
    res.send('Failed to insert item!');
  }
});

export default basicSearchRouter;
