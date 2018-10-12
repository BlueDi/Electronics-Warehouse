const express = require("express");
var pgp = require("pg-promise")();

const app = express();
const port = process.env.PORT || 5000;
var db = pgp('postgres://postgres:password@127.0.0.1:5432/postgres');

const cat_query = "SELECT * FROM category;";
const items_query =
  "SELECT item.name, item.reference, item.condition, item.details, item.manufacturer, item.count FROM item;";

app.get("/api/hello/", (req, res) => {
  res.json("Hello!");
});

app.get("/api/category/", (req, res) => {
  db.any(cat_query)
    .then(function(data) {
      res.send(data);
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
