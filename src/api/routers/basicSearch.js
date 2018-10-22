const express = require('express');
const db = require('@api/db.js');

const basicSearchRouter = express.Router();

basicSearchRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

basicSearchRouter.post('/table/:id', async (req, res) => {
  var body = req.body;
  console.log(body.search);

  var query = `SELECT * FROM item WHERE name LIKE %'${body.search}'%;`;

  console.log(query);
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
  console.log(data);
  res.send(data);
});

export default basicSearchRouter;
