const express = require('express');
const db = require('@api/db.js');

const itemRouter = express.Router();

itemRouter.get('/item_description/:id', async (req, res) => {
  const item_description_query = `SELECT item.name, convert_from(item.image, 'UTF-8') as image, item.count, item.location, item.condition, item.details, item.manufacturer, item.reference
    FROM item
    WHERE item.id = ${req.params.id}`;

  try {
    const data = await db.one(item_description_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item description!', e);
    res.send('Failed to retrieve item description!');
  }
});

itemRouter.get('/item_properties/:id', async (req, res) => {
  const in_depth_item_ppt_list_query = `SELECT item_property.property_id, item_property.value, property.unit, property.name
    FROM item_property, property
    WHERE property.id = item_property.property_id and item_property.item_id = ${
      req.params.id
    }`;

  try {
    const data = await db.any(in_depth_item_ppt_list_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item properties! ', e);
    res.send('Failed to retrieve item properties!');
  }
});

itemRouter.get('/item_category/:id', async (req, res) => {
  //TODO: averiguar catergorias encadeadas

  const in_depth_item_catg_query = `SELECT category.name
    FROM category, item
    WHERE category.id = item.category_id and item.id = ${req.params.id}`;

  try {
    const data = await db.any(in_depth_item_catg_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item category! ', e);
    res.send('Failed to retrieve item category!');
  }
});

itemRouter.post('/item_edit', async (req, res) => {
  let newItem = req.body;

  let item_update_query = `UPDATE item
    SET name = '${newItem.name}',
        image = '${newItem.image}',
        count = ${newItem.count},
        location = '${newItem.location}',
        condition = '${newItem.condition}',
        details = '${newItem.details}',
        manufacturer = '${newItem.manufacturer}',
        reference = '${newItem.reference}'
    WHERE id = ${newItem.id}; \n`;

  for (let i = 0; i < newItem.properties.length; i++) {
    let property = newItem.properties[i];

    if (!property.edited) {
      continue;
    }

    let property_update_query = `UPDATE item_property
      SET value = '${property.value}'
      WHERE property_id = ${property.property_id} and item_id = ${
      newItem.id
    }; \n`;

    item_update_query = item_update_query.concat(property_update_query);
  }

  try {
    db.none(item_update_query);
  } catch (e) {
    console.log('Error editing item!', e);
    res.send('Failed to edit item!');
  }
});

export default itemRouter;
