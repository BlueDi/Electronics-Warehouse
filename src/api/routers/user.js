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
const queryPermissions = ` SELECT can_read, can_request, can_edit, user_path FROM permissions WHERE id = $1;`;
const querySignup = `INSERT INTO users (id, login, password, password_salt, password_iterations, email, user_permissions) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id`;
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

/**
 * Checks if the given permissions key matches any of the permissions key
 * @param  {string} given_key Key inserted by the user
 * @return {Object}           Object representing a permission of the user (see table 'permissions')
 */
var getPermissions = async function(given_key) {
  const perm_data = await db.any(getPermissionsQuery);

  for (var i = 0; i < perm_data.length; i++) {
    const data = perm_data[i];
    const stored_key = data.key;
    const salt = data.key_salt;
    const it = data.key_iterations;
    if (
      passwordMatches(given_key, stored_key, salt, it) ||
      stored_key.length == 0
    ) {
      return data;
    }
  }
};

/**
 * Checks if the given password matches the stored password
 * @param  {String} attempt_key Password inserted by user
 * @param  {Object} stored_key  Password stored in the database ( Buffer object)
 * @param  {String} salt        Salt stored in the database
 * @param  {Number} it          Number of iterations stored in database
 * @return {Boolean}            Whether it matches or not
 */
var passwordMatches = function(attempt_key, stored_key, salt, it) {
  const hash_salted_key = crypto.pbkdf2Sync(
    attempt_key,
    salt,
    it,
    KEY_LEN,
    encryption
  );
  return hash_salted_key.equals(stored_key);
};

/**
 * Login the user.
 * @param {Object} req - Details of the request
 * @param {String} req.body.name - Name of the user to login (can be username or email)
 * @param {String} req.body.password - Plain-text password user inserted
 * @return {object} User details
 */
userRouter.post('/login', async function(req, res) {
  try {
    const {
      id,
      login,
      password,
      password_salt,
      password_iterations,
      user_permissions
    } = await db.one(queryLogin, [req.body.name]);

    if (
      passwordMatches(
        req.body.password,
        password,
        password_salt,
        password_iterations
      )
    ) {
      const { can_read, can_request, can_edit, user_path } = await db.one(
        queryPermissions,
        user_permissions
      );

      let body = {
        id,
        name: login,
        can_read,
        can_request,
        can_edit,
        user_path
      };
      res.status(200).send(body);
    } else {
      res.status(401).send('Wrong password supplied!');
    }
  } catch (e) {
    res.status(401).send('Wrong username and/or password supplied!');
  }
});

/**
 * Signs up the user
 * @param {Object} req - Fields of the request
 * @param {String} req.body.name - Username to use for the user
 * @param {String} req.body.email - Email of the user
 * @param {String} req.body.password - Password to use for the user
 *
 * @type {String}
 */
userRouter.post('/signup', async function(req, res) {
  const { password, name, email } = req.body;
  const perm_key = req.body.permission;
  const permissions = await getPermissions(perm_key);
  if (perm_key.length > 0 && permissions.id == 1) {
    // If permission key is wrong
    res.status(401).send({
      header: 'Permission key wrong!',
      detail: 'Try again or clear field to signup as a student'
    });
    return;
  }

  const salt = genSalt();
  const iterations = Math.floor(Math.random() * MIN_IT + MIN_IT); // [500000, 1000000[

  try {
    const gen_key = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      KEY_LEN,
      encryption
    );
    const data = await db.one(querySignup, [
      name,
      gen_key,
      salt,
      iterations,
      email,
      permissions.id
    ]);
    res.status(200).send({
      id: data.id,
      name,
      can_read: permissions.can_read,
      can_request: permissions.can_request,
      can_edit: permissions.can_edit,
      user_path: permissions.user_path
    });
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

/**
 * Gets all the professors name from the database
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 * @return {Object}     Array of objects with 'id' and 'name'
 */
userRouter.get('/professors', async function(req, res) {
  try {
    const data = await db.any(professors_query);
    res.send(data);
  } catch (e) {
    console.error('Error retrieving professors!');
    res.status(500).send('Failed to retrieve professors');
  }
});

/**
 * Gets the permissions of the user
 * @param  {Object} req             Request object
 * @param  {Number} req.params.id   ID of the user
 * @param  {Object} res             Response object
 * @return {Object}                 Object with the user permissions
 */
userRouter.get('/user_permissions/:id', async function(req, res) {
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
