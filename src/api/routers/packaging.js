const express = require('express');
const db = require('@api/db.js');

const packagingRouter = express.Router();

/**
 * Gets all available packagings
 * @return {Object} Array of objects with package names
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
