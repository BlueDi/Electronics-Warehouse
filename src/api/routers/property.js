const express = require('express');
const db = require('@api/db.js');

const propertyRouter = express.Router();

const queryItemProperties = `
  SELECT *
  FROM property
  JOIN item_property
    ON item_property.property_id = property.id
  		AND item_property.item_id = $1
`;

/**
 * Fetch item properties
 * get parameter: item id
 */
propertyRouter.get('/item_properties2/:id', async (req, res) => {
  try {
    const data = await db.any(queryItemProperties, req.params.id);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve selected properties info!');
  }
});

/**
 * Fetch properties info (id, name, unit and if it's a number or not)
 * post body: array containing the ids of the properties to be fetched
 */
propertyRouter.post('/properties_info', async (req, res) => {
  try {
    let propertyIds = req.body;

    let property_list = propertyIds.map(property => {
      return property.property_id;
    });

    if (property_list.length == 0) {
      let data = [];
      res.send(data);
      return;
    }

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

propertyRouter.post('/get_categories_properties', async (req, res) => {
  var body = req.body;
  var query = `SELECT Prop.id, Prop.name, Prop.number, Prop.unit
                FROM category_property as CP
                NATURAL JOIN Property as Prop
                WHERE CP.category_id = ${body.key};`;

  try {
    const data = await db.any(query, [true]);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving selected properties info!', e);
    res.send('Failed to retrieve selected properties info!');
  }
});

propertyRouter.get('/get_all_units', async (req, res) => {
  var query = `SELECT Prop.id, Prop.unit FROM Property as Prop`;

  try {
    const data = await db.any(query, [true]);
    for (var i = 0; i < data.length; i++) {
      if (data[i].unit == null) {
        data[i].unit = 'No Unit';
        break;
      }
    }
    res.send(data);
  } catch (e) {
    console.log('Error retrieving all units!', e);
    res.send('Failed to retrieve all units!');
  }
});

export default propertyRouter;
