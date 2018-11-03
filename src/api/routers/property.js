const express = require('express');
const db = require('@api/db.js');

const propertyRouter = express.Router();

propertyRouter.post('/properties_info', async (req, res) => {
  try {
    let propertyIds = req.body;

    let property_list = propertyIds.map(property => {
      return property.property_id;
    });

    let get_properties_info_query = `SELECT * 
    FROM property
    WHERE id IN(${property_list});`;

    const data = await db.any(get_properties_info_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving selected properties info!', e);
    res.send('Failed to retrieve selected properties info!');
  }
});

export default propertyRouter;
