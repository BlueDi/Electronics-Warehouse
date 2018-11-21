const express = require('express');
const db = require('@api/db.js');

const requestRouter = express.Router();

const queryRequest = `
  SELECT *
  FROM request_workflow
  WHERE id = $1
`;

/*
const queryRequestAll = `
  SELECT request_workflow.*, users.login AS requester, users2.login AS professor, users3.login AS manager
  FROM request_workflow INNER JOIN users
  ON request_workflow.requester_id = users.id
  INNER JOIN users AS users2
  ON request_workflow.professor_id = users2.id
  INNER JOIN users AS users3
  ON request_workflow.manager_id = users3.id
`;
*/

const queryRequestAll = `
  SELECT DISTINCT ON(request_workflow.id) request_workflow.*, users.login AS requester,
    users2.login AS professor, users3.login AS manager
  FROM request_workflow, users, users AS users2, users AS users3
  WHERE (request_workflow.requester_id = users.id OR request_workflow.requester_id ISNULL)
    AND (request_workflow.professor_id = users2.id OR request_workflow.professor_id ISNULL)
    AND (request_workflow.manager_id = users3.id OR request_workflow.manager_id ISNULL)
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
