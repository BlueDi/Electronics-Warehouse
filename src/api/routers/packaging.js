const express = require('express');
const db = require('@api/db.js');

const packagingRouter = express.Router();

/**
 * Fetch all packagings in the database
 */
packagingRouter.get('/all_packages', async (req, res) => {
  const all_packages_query = `SELECT * FROM packaging`;

  try {
    const data = await db.any(all_packages_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving all packages!', e);
    res.send('Failed to retrieve all packages!');
  }
});

export default packagingRouter;
