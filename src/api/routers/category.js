import { service } from '@utils';

const express = require('express');
const db = require('@api/db.js');

const categoryRouter = express.Router();

categoryRouter.get('/all_categories', async (req, res) => {
  const all_categories_query = `SELECT category.id, category.name
    FROM category`;

  try {
    const data = await db.any(all_categories_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving all categories!', e);
    res.send('Failed to retrieve all categories!');
  }
});

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
        console.log('PROP INFO', response.data);
        res.send(response.data);
      })
      .catch(e => {
        console.log('Error retrieving item category properties!', e);
        res.send('Failed to retrieve item category properties!');
      });
  });
  console.log(promise);
});

export default categoryRouter;