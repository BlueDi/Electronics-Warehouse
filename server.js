const express = require("express");
var pgp = require("pg-promise")();

const app = express();
const port = process.env.PORT || 5000;
var db = pgp('postgres://postgres:password@127.0.0.1:5432/postgres');

const items_query = 'SELECT item.name, item.reference, item.condition, item.details, item.manufacturer, item.count FROM item;'
const cat_query = 'SELECT category.name AS cat_name, property.name AS prop_name  FROM category, property, category_property WHERE category.id = category_property.category_id AND property.id = category_property.property_id;'

app.get("/api/hello/", (req, res) => {
  res.json("Hello!");
});

// Sends all the categories in the following structure:
// {
//   <category1_name>: [ <property1_name>, <property2_name>, (...) ],
//   <category2_name>: [ <property1_name>, <property2_name>, (...) ],
// }
app.get("/api/category", (req, res) => {
  db.any(cat_query)
    .then(function(data) {
      let formatted_data = {};

      for (let i = 0; i < data.length; i++) {
        let cat = data[i]['cat_name'];

        if (!formatted_data.hasOwnProperty(cat)) {
          formatted_data[cat] = [];
        }
        formatted_data[cat].push(data[i]['prop_name'])

      }
      console.log(formatted_data);
      // res.send(formatted_data);
    })
    .catch(function(error) {
      res.send("Failed to retrieve categories!");
    });
  res.send({ express: "Hello From Express" });
});

app.get("/api/table/:id", async (req, res) => {
  try {
    const data = await db.any(items_query, [true]);
    for (var i = 0; i < data.length; i++) {
      data[i]["details"] = {
        details: data[i]["details"],
        manufacturer: data[i]["manufacturer"],
        condition: data[i]["condition"]
      };
      delete data[i]["manufacturer"];
      delete data[i]["condition"];
    }
    res.send(data);
  } catch (e) {
    res.send("Failed to retrieve items!");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
