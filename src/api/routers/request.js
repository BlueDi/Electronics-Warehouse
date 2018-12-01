const express = require('express');
const db = require('@api/db.js');

const requestRouter = express.Router();

requestRouter.get('/request_manager_all', async (req, res) => {
  const queryManagerRequestAll = `
    SELECT DISTINCT ON(request_workflow.id) request_workflow.*,
      users.login AS requester, users2.login AS professor, users3.login AS manager
    FROM request_workflow
    INNER JOIN users
    ON (request_workflow.requester_id = users.id)
    INNER JOIN users AS users2
    ON (request_workflow.professor_id = users2.id)
    LEFT JOIN users AS users3
    ON (request_workflow.manager_id = users3.id)
  `;

  try {
    const data = await db.any(queryManagerRequestAll);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected all request info!');
  }
});

requestRouter.get('/request_professor_all/:id', async (req, res) => {
  const queryProfessorRequestAll = `
    SELECT DISTINCT ON(request_workflow.id) request_workflow.*,
      users.login AS requester, users2.login AS professor, users3.login AS manager
    FROM request_workflow
    INNER JOIN users
    ON (request_workflow.requester_id = users.id)
    INNER JOIN users AS users2
    ON (request_workflow.professor_id = users2.id)
    LEFT JOIN users AS users3
    ON (request_workflow.manager_id = users3.id)
    WHERE request_workflow.professor_id = $1
  `;

  try {
    const data = await db.any(queryProfessorRequestAll, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected all request info!');
  }
});

requestRouter.get('/request_student_all/:id', async (req, res) => {
  const queryStudentRequestAll = `
    SELECT DISTINCT ON(request_workflow.id) request_workflow.*,
      users.login AS requester, users2.login AS professor, users3.login AS manager
    FROM request_workflow
    INNER JOIN users
    ON (request_workflow.requester_id = users.id)
    INNER JOIN users AS users2
    ON (request_workflow.professor_id = users2.id)
    LEFT JOIN users AS users3
    ON (request_workflow.manager_id = users3.id)
    WHERE equest_workflow.requester_id = $1
  `;

  try {
    const data = await db.any(queryStudentRequestAll, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected all request info!');
  }
});

requestRouter.get('/request/:id', async (req, res) => {
  const queryRequest = `
    SELECT request_workflow.*, users.login AS requester, users2.login AS professor, users3.login AS manager
    FROM request_workflow
    INNER JOIN users
    ON (request_workflow.requester_id = users.id)
    INNER JOIN users AS users2
    ON (request_workflow.professor_id = users2.id)
    LEFT JOIN users AS users3
    ON (request_workflow.manager_id = users3.id)
    WHERE request_workflow.id = $1
  `;

  try {
    const data = await db.one(queryRequest, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected request info!');
  }
});

requestRouter.post('/request_workflow_update/', async (req, res) => {
  const queryUpdateWorkflowRequest = `UPDATE request_workflow
    SET workflow = '${req.body.workflow}'
    WHERE id = '${req.body.id}';
  `;

  try {
    await db.none(queryUpdateWorkflowRequest);
    res.send('Request workflow update completed successfully');
  } catch (e) {
    res.send('Failed to update request workflow!');
  }
});

requestRouter.post('/request_evaluate_professor/', async (req, res) => {
  const queryProfessorEvaluateRequest = `UPDATE request_workflow
    SET date_professor_evaluated = NOW(),
        professor_accept = ${req.body.accept}
    WHERE id = '${req.body.id}';
  `;

  try {
    await db.none(queryProfessorEvaluateRequest);
    res.send('Request professor evaluation completed successfully');
  } catch (e) {
    res.send('Failed to update request professor evaluation!');
  }
});

requestRouter.post('/request_evaluate_manager/', async (req, res) => {
  const queryManagerEvaluateRequest = `UPDATE request_workflow
    SET date_manager_evaluated = NOW(),
        manager_accept = ${req.body.accept}
    WHERE id = '${req.body.id}';
  `;

  try {
    await db.none(queryManagerEvaluateRequest);
    res.send('Request manager evaluation completed successfully');
  } catch (e) {
    res.send('Failed to update request manager evaluation!');
  }
});

requestRouter.get('/request_items/:id', async (req, res) => {
  const queryRequestItems = `
    SELECT item.id
    FROM item, request_items
    WHERE request_items.request_id = $1 AND request_items.item_id = item.id
  `;

  try {
    const data = await db.any(queryRequestItems, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected request items!');
  }
});

export default requestRouter;
