const express = require("express");
var pgp = require('pg-promise')

var db = pgp('postgres://postgres:password@127.0.0.1:5432/postgres');

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/category/", (req, res) => {
  db.any('SELECT * FROM category;')
    .then(function (data) {
      console.log(data);
      res.send(data);
    })
    .catch (function (error) {
      console.log('Error! ', error);
      res.send('Failed to retrieve!');
    });
  res.send({ express: "Hello From Express" });
});

app.get("/api/table/:id", (req, res) => {
  const response =
    req.params.id == 2
      ? 2
      : [
          {
            number: "RASPBERRY-MODB+-512M",
            code: 2456986,
            description: {
              text:
                "RASPBERRY-PI - Single Board Computer, Raspberry Pi Model B+, BCM2835 CPU, Plugs Into TV and Keyboard, 512MB SDRAM",
              silicon_manufacturer: "Broadcom",
              silicon_family_name: "BCM2xxx",
              core_architecture: "ARM"
            },
            availability: 2790,
            price: 21.29
          },
          {
            number: "RASPBERRY-MODB+-512M",
            code: 2431426,
            description: {
              text: "RASPBERRY-PI - RASPBERRY PI MODEL B+ BOARD",
              silicon_manufacturer: "Broadcom",
              silicon_family_name: "BCM2xxx",
              core_architecture: "ARM"
            },
            availability: 0,
            price: null
          }
        ];
  res.send(response);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
