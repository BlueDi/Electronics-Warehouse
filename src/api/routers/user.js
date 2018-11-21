const express = require('express');
const db = require('@api/db.js');

const userRouter = express.Router();

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

//var currentID = cookies.get('id');
/*
const queryHowManyRequests = `
  SELECT count(*)
  FROM request_workflow
  WHERE professor_id = currentID
    AND professor_accept = "false"
;`;
*/
//console.log(currentID);4

/**
 * Login the user.
 *
 * @return {object} User details
 */
//  var currentID;

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

    //  currentID = req.cookies.get('id');
  } catch (e) {
    res.status(401).send('Invalid login!');
  }
});

//console.log('Aqqqqqqqqqqqqquiiiiiiiiiiiiiii  ', currentID);

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

export default userRouter;
