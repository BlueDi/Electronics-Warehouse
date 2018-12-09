const express = require('express');
const db = require('@api/db.js');
var writer = require('./mailWriter');
var nodeMailer = require('nodemailer');
var markdown = require('nodemailer-markdown').markdown;
const itemRouter = express.Router();

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'plataforma.armazem@gmail.com',
    pass: 'armazemplataforma1'
  },
  tls: { rejectUnauthorized: false }
});

transporter.use('compile', markdown(undefined));

const all_items_query = `SELECT *, convert_from(item.image, 'UTF-8') as image FROM item`;
const insert_request_query =
  'INSERT INTO request_workflow (id, cancelled, purpose, requester_id, professor_id) VALUES (DEFAULT, FALSE, $1, $2, $3) RETURNING id';
const insert_request_item =
  'INSERT INTO request_items (request_id, item_id, count) VALUES ($1, $2, $3)';
const emailsQuery = `SELECT login AS name, email, user_permissions AS permissions FROM users WHERE id=$1 OR user_permissions=3 ORDER BY user_permissions; `;

itemRouter.get('/all_items', async (req, res) => {
  try {
    const data = await db.any(all_items_query);
    for (var i = 0; i < data.length; i++) {
      data[i]['details'] = {
        details: data[i]['details'],
        manufacturer: data[i]['manufacturer'],
        condition: data[i]['condition']
      };
      delete data[i]['manufacturer'];
      delete data[i]['category_id'];
      delete data[i]['condition'];
    }
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve items!');
  }
});

itemRouter.post('/add_new_item', async (req, res) => {
  var body = req.body;
  var query =
    'INSERT INTO item (name, imageurl, count, condition, details, manufacturer, reference, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

  try {
    const data = await db.one(query, body);
    res.send(data);
  } catch (e) {
    res.send('Failed to retrieve items!');
  }
});

itemRouter.get('/item_characteristics/:id', async (req, res) => {
  const item_description_query = `SELECT item.description, convert_from(item.image, 'UTF-8') as image, item.total_stock, item.free_stock,
  item.last_price, item.location, item.user_comments, item.details, item.manufacturer, item.reference, to_char(item.last_edit, 'DD Mon YYYY HH24hMIm') as last_edit
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
  const in_depth_item_ppt_list_query = `
    SELECT item_property.property_id, item_property.value, property.unit, property.name, property.number
    FROM item_property, property
    WHERE property.id = item_property.property_id and item_property.item_id = $1`;

  try {
    const data = await db.any(in_depth_item_ppt_list_query, req.params.id);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item properties! ', e);
    res.send('Failed to retrieve item properties!');
  }
});

itemRouter.get('/item_category/:id', async (req, res) => {
  const in_depth_item_catg_query = `
    SELECT category.id, category.name, item.id AS item_id
    FROM category, item
    WHERE category.id = item.category_id
      AND item.id = ${req.params.id}`;

  try {
    const data = await db.any(in_depth_item_catg_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item category! ', e);
    res.send('Failed to retrieve item category!');
  }
});

itemRouter.get('/item_packaging/:id', async (req, res) => {
  const in_depth_item_packaging_query = `
    SELECT packaging.id, packaging.name
    FROM packaging, item
    WHERE packaging.id = item.packaging_id
      AND item.id = ${req.params.id}`;

  try {
    const data = await db.one(in_depth_item_packaging_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item packaging! ', e);
    res.send('Failed to retrieve item packaging!');
  }
});

itemRouter.get('/item_comments/:id', async (req, res) => {
  const in_depth_item_comments_query = `
    SELECT item.user_comments
    FROM item
    WHERE item.id = ${req.params.id}`;

  try {
    const data = await db.one(in_depth_item_comments_query);
    res.send(data);
  } catch (e) {
    console.log('Error retrieving item user comments! ', e);
    res.send('Failed to retrieve item comments!');
  }
});

itemRouter.post('/item_edit', async (req, res) => {
  let newItem = req.body;

  let item_update_query = `UPDATE item
    SET description = '${newItem.description}',
        image = '${newItem.image}',
        total_stock = ${newItem.total_stock},
        free_stock = ${newItem.free_stock},
        last_price = ${newItem.last_price},
        location = '${newItem.location}',
        user_comments = '${newItem.user_comments}',
        details = '${newItem.details}',
        manufacturer = '${newItem.manufacturer}',
        reference = '${newItem.reference}',
        packaging_id = ${newItem.packaging.itemPackaging.id},
        category_id = ${newItem.category.itemCategory.id},
        last_edit = NOW()
    WHERE id = ${newItem.id}; \n`;

  for (let i = 0; i < newItem.properties.length; i++) {
    let property = newItem.properties[i];

    let property_update_query = `INSERT INTO item_property (value, item_id, property_id)
      VALUES ('${property.value}', ${newItem.id}, ${property.property_id}); \n`;

    item_update_query = item_update_query.concat(property_update_query);
  }

  try {
    await db.none(item_update_query);
    res.send('Item update successful');
  } catch (e) {
    console.log('Error editing item!', e);
    res.send('Failed to edit item!');
  }
});

itemRouter.post('/item_comments_increment', async (req, res) => {
  try {
    let parameters = [req.body.itemId, req.body.newComment.trimRight()];

    const data = await db.func('increment_user_comments', parameters);
    res.send(data);
  } catch (e) {
    res.send('Failed to increment item comments!');
  }
});

itemRouter.post('/request_items', async (req, res) => {
  let { cart, details, professor_id, user_id, user_name } = req.body;
  let msg = emailHeader('', user_name),
    items_msg = [];

  if (cart != undefined && cart.length > 0) {
    try {
      const data = await db.one(insert_request_query, [
        details,
        user_id,
        professor_id
      ]);
      insertRequestItems(cart, data.id, items_msg);

      msg = emailBody(msg, items_msg, details, data.id);
      sendEmails(msg, professor_id, user_name);
      res.send('OK');
    } catch (e) {
      res.status(401).send(e);
    }
  } else {
    res.status(404).send('No items found in cart!');
  }
});

var insertRequestItems = function(cart, request_id, items_msg) {
  for (let i = 0; i < cart.length; i++) {
    const info = cart[i];
    if (info.amount > 0) {
      db.none(insert_request_item, [request_id, info.id, info.amount]);
      let item_msg = writer.addBold('', info.amount, ' of ');
      items_msg.push(
        writer.addLink(item_msg, info.name, '/item/' + info.id, '')
      );
    }
  }
};

var emailHeader = function(msg, name) {
  msg = writer.addText(msg, 'Student ');
  msg = writer.addBold(msg, name, ' ');
  msg = writer.addText(msg, 'has requested the items:\n\n');
  return msg;
};

var emailBody = function(msg, items, details, request_id) {
  msg = writer.addUnorderedList(msg, items, '\n\n');
  msg = writer.addBold(msg, 'Details:', '\n');
  msg = writer.addRule(msg, '');
  msg = writer.addText(msg, details + '\n');
  msg = writer.addRule(msg, '\n');
  msg = writer.addText(msg, 'Here is the direct link to the ');
  msg = writer.addLink(msg, 'request', '/request/' + request_id, '');
  return msg;
};

var emailFooter = function(msg, is_professor, professor_name) {
  if (!is_professor) {
    let new_msg =
      msg + '\n\n' + 'Professor ' + writer.addBold('', professor_name, '');
    return (
      new_msg +
      ' has received the request.\nYou will be notified once it is accepted!'
    );
  } else {
    return msg + '\n\n' + 'Please review the request as soon as possible';
  }
};

var mailOptions = {
  from: 'plataforma.armazem@gmail.com',
  to: undefined,
  subject: undefined,
  markdown: undefined
};

var sendEmails = async function(msg, professor_id, student_name) {
  const data = await db.any(emailsQuery, [professor_id]);
  const subject = 'Student "' + student_name + '" has made a new request';

  if (data.length > 0) {
    console.log(data);
    if (data[0].permissions == 2) {
      let prof_name = data[0].name;
      const prof_msg = emailFooter(msg, true, undefined);
      sendEmail(prof_msg, data[0].email, subject);

      for (let i = 1; i < data.length; i++) {
        sendEmail(emailFooter(msg, false, prof_name), data[1].email, subject);
      }
    } else {
      throw new Error('No professor matching id(' + professor_id + ') found!');
    }
  } else {
    throw new Error('No professor or manager found!');
  }
};

var sendEmail = function(msg, to, subject) {
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.markdown = msg;
  transporter.sendMail(mailOptions, writer.mailCallBack);
};

export default itemRouter;
