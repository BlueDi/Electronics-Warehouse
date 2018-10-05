const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/hello", (req, res) => {
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
            price: undefined
          }
        ];
  res.send(response);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
