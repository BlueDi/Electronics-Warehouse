const express = require('express');
const db = require('@api/db.js');

const requestRouter = express.Router();

const queryRequest = `
  SELECT *
  FROM request_workflow
  WHERE id = $1
`;

const queryRequestAll = `
  SELECT *
  FROM request_workflow
`;

const queryRequestItems = `
  SELECT *, convert_from(item.image, 'UTF-8') as image
  FROM item, request_items
  WHERE request_items.request_id = $1 AND request_items.item_id = item.id
`;

requestRouter.get('/request_all', async (req, res) => {
  try {
    const data = await db.any(queryRequestAll);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected all request info!');
  }
});

requestRouter.get('/request/:id', async (req, res) => {
  try {
    const data = await db.any(queryRequest, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected request info!');
  }
});

requestRouter.get('/request_items/:id', async (req, res) => {
  try {
    const data = await db.any(queryRequestItems, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected request items!');
  }
});

export default requestRouter;
