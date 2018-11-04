import express from 'express';

const loginRouter = express.Router();

const users = [
  {
    key: 1,
    id: 23,
    security: 3,
    name: 'Manager',
    password: 'admin',
    userPath: '/course'
  },
  {
    key: 2,
    id: 78,
    security: 2,
    name: 'Professor',
    password: 'prof',
    userPath: '/course'
  },
  {
    key: 3,
    id: 54,
    security: 1,
    name: 'Student',
    password: 'student',
    userPath: '/table/1'
  }
];

loginRouter.post('/login', function(req, res) {
  let user = users.find(
    u => u.name === req.body.name && u.password === req.body.password
  );
  if (user != undefined) {
    res.json(user);
  } else res.json(0);
});

export default loginRouter;
