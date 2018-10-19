const express = require('express');
const db = require('@api/db.js');

const addNewItemRouter = express.Router();

addNewItemRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

addNewItemRouter.post('/addNewItem', async (req, res) => {
  var body = req.body;

  var query = `INSERT INTO item (name, imageurl, count, condition, details, manufacturer, reference, category_id)
                VALUES ('${body.name}', '${body.imageurl}', ${body.count},
                 '${body.manufacturer}', '${body.condition}', '${
    body.details
  }', '${body.reference}', ${body.category_id});`;

  console.log(query);

  try {
    const data = await db.any(query, [true]);
    res.send(data);
  } catch {
    res.send('Failed to insert item!');
  }
});

export default addNewItemRouter;
