const express = require('express');
var nodeMailer = require('nodemailer');
const db = require('@api/db.js');
const requestRouter = express.Router();
var markdown = require('nodemailer-markdown').markdown;

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'plataforma.armazem@gmail.com',
    pass: 'armazemplataforma1'
  },
  tls: { rejectUnauthorized: false }
});
transporter.use('compile', markdown(undefined));

const queryManagerRequestAll = `
  SELECT DISTINCT ON(request_workflow.id) request_workflow.*, to_char(request_workflow.date_sent, 'DD Mon YYYY HH24hMIm') as date_sent,
    to_char(request_workflow.date_cancelled, 'DD Mon YYYY HH24hMIm') as date_cancelled,
    to_char(request_workflow.date_professor_evaluated, 'DD Mon YYYY HH24hMIm') as date_professor_evaluated,
    to_char(request_workflow.date_manager_evaluated, 'DD Mon YYYY HH24hMIm') as date_manager_evaluated,
    users.login AS requester, users2.login AS professor, users3.login AS manager
  FROM request_workflow
  INNER JOIN users
  ON (request_workflow.requester_id = users.id)
  INNER JOIN users AS users2
  ON (request_workflow.professor_id = users2.id)
  LEFT JOIN users AS users3
  ON (request_workflow.manager_id = users3.id)
`;

const queryProfessorRequestAll = `
  SELECT DISTINCT ON(request_workflow.id) request_workflow.*, to_char(request_workflow.date_sent, 'DD Mon YYYY HH24hMIm') as date_sent,
    to_char(request_workflow.date_cancelled, 'DD Mon YYYY HH24hMIm') as date_cancelled,
    to_char(request_workflow.date_professor_evaluated, 'DD Mon YYYY HH24hMIm') as date_professor_evaluated,
    to_char(request_workflow.date_manager_evaluated, 'DD Mon YYYY HH24hMIm') as date_manager_evaluated,
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

const queryStudentRequestAll = `
  SELECT DISTINCT ON(request_workflow.id) request_workflow.*, to_char(request_workflow.date_sent, 'DD Mon YYYY HH24hMIm') as date_sent,
    to_char(request_workflow.date_cancelled, 'DD Mon YYYY HH24hMIm') as date_cancelled,
    to_char(request_workflow.date_professor_evaluated, 'DD Mon YYYY HH24hMIm') as date_professor_evaluated,
    to_char(request_workflow.date_manager_evaluated, 'DD Mon YYYY HH24hMIm') as date_manager_evaluated,
    users.login AS requester, users2.login AS professor, users3.login AS manager
  FROM request_workflow
  INNER JOIN users
  ON (request_workflow.requester_id = users.id)
  INNER JOIN users AS users2
  ON (request_workflow.professor_id = users2.id)
  LEFT JOIN users AS users3
  ON (request_workflow.manager_id = users3.id)
  WHERE request_workflow.requester_id = $1
`;

const queryUpdateWorkflowRequest = `UPDATE request_workflow SET workflow = '$1' WHERE id = '$2'`;

const queryProfessorEvaluateRequest = `UPDATE request_workflow
  SET date_professor_evaluated = NOW(), professor_accept = $1 WHERE id = '$2';`;

const queryManagerEvaluateRequest = `UPDATE request_workflow
  SET date_manager_evaluated = NOW(), manager_accept = $1 WHERE id = '$2';
`;

const queryRequestItems = `
  SELECT item.id
  FROM item, request_items
  WHERE request_items.request_id = $1 AND request_items.item_id = item.id
`;

const queryRequest = `
  SELECT request_workflow.*, to_char(request_workflow.date_sent, 'DD Mon YYYY HH24hMIm') as date_sent,
    to_char(request_workflow.date_cancelled, 'DD Mon YYYY HH24hMIm') as date_cancelled,
    to_char(request_workflow.date_professor_evaluated, 'DD Mon YYYY HH24hMIm') as date_professor_evaluated,
    to_char(request_workflow.date_manager_evaluated, 'DD Mon YYYY HH24hMIm') as date_manager_evaluated,
    users.login AS requester, users2.login AS professor, users3.login AS manager
  FROM request_workflow
  INNER JOIN users
  ON (request_workflow.requester_id = users.id)
  INNER JOIN users AS users2
  ON (request_workflow.professor_id = users2.id)
  LEFT JOIN users AS users3
  ON (request_workflow.manager_id = users3.id)
  WHERE request_workflow.id = $1
`;

var simpleGet = async function(query, params, err_msg, req, res) {
  try {
    let data;

    if (params) {
      data = await db.any(query, params);
    } else {
      data = await db.any(query);
    }
    res.status(200).send(data);
  } catch (err) {
    res.status(401).send(err_msg);
  }
};

var simplePost = async function(query, params, err_msg, succ_msg, req, res) {
  try {
    await db.none(query, params);
    res.status(200).send(succ_msg);
  } catch (err) {
    res.status(401).send(err_msg);
  }
};

requestRouter.get('/request_manager_all', async (req, res) => {
  const err_msg = 'Failed to retrieve selected all request info!';
  simpleGet(queryManagerRequestAll, undefined, err_msg, req, res);
});

requestRouter.get('/request_professor_all/:id', async (req, res) => {
  const err_msg = 'Failed to retrieve selected all request info!';
  simpleGet(queryProfessorRequestAll, req.params.id, err_msg, req, res);
});

requestRouter.get('/request_student_all/:id', async (req, res) => {
  const err_msg = 'Failed to retrieve selected all request info!';
  simpleGet(queryStudentRequestAll, req.params.id, err_msg, req, res);
});

requestRouter.get('/request/:id', async (req, res) => {
  const err_msg = 'Failed to retrieve selected request info!';
  simpleGet(queryRequest, req.params.id, err_msg, req, res);
});

requestRouter.post('/request_workflow_update/', async (req, res) => {
  const succ_msg = 'Request workflow update completed successfully',
    err_msg = 'Failed to update request workflow!',
    params = [req.body.workflow, req.body.id];
  simplePost(queryUpdateWorkflowRequest, params, err_msg, succ_msg, req, res);
});

requestRouter.post('/request_evaluate_professor/', async (req, res) => {
  const succ_msg = 'Request professor evaluation completed successfully',
    err_msg = 'Failed to update request professor evaluation!',
    params = [req.body.accept, req.body.id];
  simplePost(
    queryProfessorEvaluateRequest,
    params,
    err_msg,
    succ_msg,
    req,
    res
  );
});

requestRouter.post('/request_evaluate_manager/', async (req, res) => {
  const succ_msg = 'Request manager evaluation completed successfully',
    err_msg = 'Failed to update request manager evaluation!',
    params = [req.body.accept, req.body.id];
  simplePost(queryManagerEvaluateRequest, params, err_msg, succ_msg, req, res);
});

requestRouter.get('/request_items/:id', async (req, res) => {
  const err_msg = 'Failed to retrieve selected request items!';
  simpleGet(queryRequestItems, req.params.id, err_msg, req, res);
});

export default requestRouter;
