const express = require('express');
const db = require('@api/db.js');

const userRouter = express.Router();

const professors_query = 'SELECT id, login FROM Users WHERE user_permissions=2';

const queryLogin = `
  SELECT id, login, user_permissions
  FROM users
  WHERE login = $1
    AND password = $2
;`;

const queryPermissions = `
  SELECT *
  FROM permissions
  WHERE id = $1
;`;

/**
 * Login the user.
 *
 * @return {object} User details
 */
userRouter.post('/login', async (req, res) => {
  try {
    const dataLogin = await db.one(queryLogin, [
      req.body.name,
      req.body.password
    ]);
    const dataPermissions = await db.one(
      queryPermissions,
      dataLogin.user_permissions
    );
    delete dataPermissions['id'];
    let merged = { ...dataLogin, ...dataPermissions };
    res.status(200).send(merged);
  } catch (e) {
    res.status(401).send('Invalid login!');
  }
});

/**
 * Logout the user.
 * Destroys the stored cookie.
 */
userRouter.post('/logout', function(req, res) {
  req.session.destroy();
  for (var key in req.cookies) {
    res.clearCookie(key, { path: '/' });
  }
  res.sendStatus(200);
});

userRouter.get('/professors', async function(req, res) {
  try {
    const data = await db.any(professors_query);
    res.send(data);
  } catch (e) {
    console.error('Error retrieving professors!');
    res.status(500).send('Failed to retrieve professors');
  }
});

userRouter.get('/user_permissions/:id', async (req, res) => {
  const user_role_query = `SELECT users.user_permissions
    FROM users
    WHERE users.id = ${req.params.id}`;
  try {
    const data = await db.one(user_role_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving user role!', e);
    res.send('Failed to retrieve user role!');
  }
});

export default userRouter;
