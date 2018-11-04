const express = require('express');
const db = require('@api/db.js');

const basicSearchRouter = express.Router();

basicSearchRouter.get('/hello', (req, res) => {
  res.send('Hello From Express');
});

basicSearchRouter.post('/table/:id', async (req, res) => {
  var body = req.body;

  var allData = [],
    query;

  for (var index = 0; index < body.length; index++) {
    if (body[index].criteria === 'Name') {
      query = `SELECT * FROM item WHERE name ILIKE '%${body[index].search}%';`;
      const data = await db.any(query, [true]);
      if (data.length === 0) allData = [];
      allData = allData.concat(data);
    }

    if (body[index].criteria === 'Manufacturer') {
      query = `SELECT * FROM item WHERE manufacturer ILIKE '%${
        body[index].search
      }%';`;
      const data2 = await db.any(query, [true]);
      if (data2.length === 0) allData = [];
      allData = allData.concat(data2);
    }

    if (body[index].criteria === 'Reference Number') {
      query = `SELECT * FROM item WHERE reference ILIKE '%${
        body[index].search
      }%';`;
      const data3 = await db.any(query, [true]);
      if (data3.length === 0) allData = [];
      allData = allData.concat(data3);
    }
  }

  var stored;
  const set = new Set();

  if (body.length > 1 && allData.length != 0) {
    for (var i = 0; i < allData.length; i++) {
      var object = allData[i];
      stored = object[Object.keys(object)[0]];
      for (var j = i + 1; j < allData.length; j++) {
        var current = allData[j][Object.keys(allData[j])[0]];
        if (stored === current && !set.has(allData[i])) {
          set.add(allData[i]);
          console.log(!set.has(allData[i]));
          break;
        }
      }
    }
    let finalResults = Array.from(set);
    allData = finalResults;
  }

  for (var k = 0; i < allData.length; k++) {
    if (allData[k])
      allData[k]['details'] = {
        details: allData[k]['details'],
        manufacturer: allData[k]['manufacturer'],
        condition: allData[k]['condition']
      };
    delete allData[k]['manufacturer'];
    delete allData[k]['condition'];
  }

  res.send(allData);
});

export default basicSearchRouter;
