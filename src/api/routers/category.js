import { service } from '@utils';

const express = require('express');
const db = require('@api/db.js');

const categoryRouter = express.Router();

/**
 * Fetch all categories in database
 */
categoryRouter.get('/all_categories', async (req, res) => {
  const all_categories_query = `SELECT category.id, category.name
    FROM category;`;

    const data = await db.any(all_categories_query, [true]);
    res.send(data);
});


/**
 * Fetch item properties for a given category (this will include both the category properties, and the item properties, which are independent from the category)
 * post body: object containing the item and category ids
 */
categoryRouter.post('/item_category_properties', async (req, res) => {
  let promise = new Promise(resolve => {
    let parameters = [parseInt(req.body.itemId), req.body.newCategoryId];

    const data = db.func('get_item_new_properties_dynamic_cat', parameters);
    resolve(data);
  }).then(propertyIds => {
    let apiUrl = '/properties_info';

    service
      .post(apiUrl, propertyIds)
      .then(response => {
        res.send(response.data);
      })
      .catch(e => {
        console.log('Error retrieving item category properties!', e);
        res.send('Failed to retrieve item category properties!');
      });
  });
  console.log(promise);
});

/**
 * Fetch category ancestor tree (ancestors of the given category, including the category itself)
 * get parameter: category id
 */
categoryRouter.get('/category_tree/:id', async (req, res) => {
  try {
    const data = await db.func('get_category_tree', req.params.id);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving category tree!', e);
    res.send('Failed to retrieve category tree!');
  }
});

/**
 * Add category id and property_id to the category_property table
 * 
 */
categoryRouter.post('/add_category_property', async (req, res) => {
  var tempQuery = `INSERT INTO category_property (category_id, property_id) VALUES `;

  for(var i = 0; i < req.body.length - 2; i++){
    if(i < req.body.length - 3)
      tempQuery += `('${req.body[req.body.length-2]}', '${req.body[i].key}'), `;
    else
      tempQuery += `('${req.body[req.body.length-2]}', '${req.body[i].key}'); `;
  }

  console.log(tempQuery);


  try {
    const data = await db.any(tempQuery, [true]);
    res.send(data);
  } catch (e) {
    res.send('Failed to fetch all the categories!');
  }
});


/**
 * Fetch category descendant tree (descendants of the given category - children, grandchildren, grandgrandchildren..., does not include the category itself)
 * get parameter: category id
 */
categoryRouter.get('/category_descendant_tree/:id', async (req, res) => {
  try {
    const data = await db.func('get_category_descendant_tree', req.params.id);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving category descendant tree!', e);
    res.send('Failed to retrieve category descendant tree!');
  }
});

export default categoryRouter;
