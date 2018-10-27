const express = require('express');
const db = require('@api/db.js');

const tablesRouter = express.Router();

const items_query = `
  SELECT
    item.id,
    item.name,
    convert_from(item.image, 'UTF-8') as image,
    item.count,
    item.location,
    item.condition,
    item.details,
    item.manufacturer,
    item.reference
  FROM item
`;

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
