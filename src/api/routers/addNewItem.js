const express = require('express');
const db = require('@api/db.js');

const addNewItemRouter = express.Router();

addNewItemRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

addNewItemRouter.post('/addNewItem', async (req, res) => {
  var body = req.body;
  var query =
    'INSERT INTO item (name, imageurl, count, condition, details, manufacturer, reference, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

  try {
    const data = await db.one(query, body);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve items!');
  }
});

export default addNewItemRouter;
