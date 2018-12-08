const express = require('express');
var crypto = require('crypto');
const db = require('@api/db.js');
const userRouter = express.Router();

const KEY_LEN = 64;
const SALT_LEN = 32;
const MIN_IT = 500000;
const encryption = 'sha512';
// const manager_key = 'RuiCarvalhoManager';
// const professor_key = 'ArmandoSousaProfessor';

const professors_query = 'SELECT id, login FROM Users WHERE user_permissions=2';
const queryLogin = `
  SELECT id, login, password, password_salt, password_iterations, email, user_permissions
  FROM users WHERE login = $1 OR email = $1;`;
const queryPermissions = ` SELECT * FROM permissions WHERE id = $1;`;
const querySignup = `INSERT INTO users (login, password, password_salt, password_iterations, email, user_permissions) VALUES ($1, $2, $3, $4, $5, $6);`;
const getPermissionsQuery = `SELECT * FROM permissions ORDER BY id DESC`;

/**
 * Generates random string of characters i.e salt
 * @function
 * @param {Number} length - Length of the random string.
 */
var genSalt = function() {
  return crypto
    .randomBytes(Math.ceil(SALT_LEN / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, SALT_LEN); /** return required number of characters */
};

var getPermissions = async function(given_key) {
  const perm_data = await db.any(getPermissionsQuery);

  for (var i = 0; i < perm_data.length; i++) {
    const data = perm_data[i];
    const stored_key = data.key;
    const salt = data.key_salt;
    const it = data.key_iterations;

    const gen_key = crypto.pbkdf2Sync(given_key, salt, it, KEY_LEN, encryption);
    if (gen_key.equals(stored_key) || stored_key.length == 0) {
      return data;
    }
  }
};

/**
 * Login the user.
 *
 * @return {object} User details
 */
userRouter.post('/login', async (req, res) => {
  try {
    const dataLogin = await db.one(queryLogin, [req.body.name]);
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
 * Signs up the user
 * @param {Object} req - Fields of the request
 * @param {String} req.name - Username to use for the user
 * @param {String} req.email - Email of the user
 * @param {String} req.password - Password to use for the user
 *
 * @type {String}
 */
userRouter.post('/signup', async (req, res) => {
  // genPermissionKeys();
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const perm_key = req.body.permission;
  const permissions = getPermissions(perm_key);
  const salt = genSalt();
  const iterations = Math.floor(Math.random() * MIN_IT + MIN_IT); // [500000, 1000000[

  try {
    crypto.pbkdf2(
      req.body.password,
      salt,
      iterations,
      KEY_LEN,
      encryption,
      function(err, gen_key) {
        if (err) {
          throw err;
        }
        db.none(querySignup, [
          name,
          gen_key,
          salt,
          iterations,
          email,
          permissions.id
        ]);
        res.sendStatus(200);
      }
    );
  } catch (e) {
    console.error(e);
    res.status(400).send('Failed to signup!');
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
