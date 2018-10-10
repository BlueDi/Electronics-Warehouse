const express = require('express');
var pgp = require('pg-promise')();

const app = express();
const port = process.env.PORT || 5000;
var db = pgp('postgres://postgres:password@127.0.0.1:5432/postgres');

const cat_query = 'SELECT * FROM category;';
const items_query = 'SELECT item.nome, item.reference, item.condition, item.details, item.manufacturer, item.count FROM item;'

app.get("/api/hello/", (req, res) => {
  console.log('Hello!')
  res.send('Hello!');
});

app.get("/api/category/", (req, res) => {
  console.log('Category');
  db.any(cat_query)
    .then(function (data) {
      console.log(data);
      res.send(data);
    })
    .catch (function (error) {
      console.log('Error retrieving categories! ', error);
      res.send('Failed to retrieve categories!');
    });
  res.send({ express: "Hello From Express" });
});

app.get("/api/table/:id", (req, res) => {
  console.log('TABLE! -> ID = ', req.params.uid);
  db.any(items_query)
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i]['details'] = {
          'details': data[i]['details'],
          'manufacturer': data[i]['manufacturer'],
          'condition': data[i]['condition']
        };
        delete data[i]['manufacturer'];
        delete data[i]['condition'];
      }
      console.log(data);
      res.send(data);
    })
    .catch (function (error) {
      console.log('Error retrieving items! ', error);
      res.send('Failed to retrieve items!');
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
