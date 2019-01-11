<<<<<<< HEAD
const router = require('express').Router();
const cors = require('cors');
const fs = require('fs');
=======
const router = require("express").Router();
const cors = require("cors");
>>>>>>> adding client contribute page

<<<<<<< HEAD
const { readJsonFile, fetchJsonURL, handleResultsOfPromises, reconizeFileUpload } = require('../utils/helpers');
=======
const {
  readJsonFile,
  fetchJsonURL,
  handleResultsOfPromises,
  reconizeFileUpload
} = require("../utils/helpers");
>>>>>>> adding client contribute page

const db = require("../db/");

const columnsMap = {
  link: "link",
  market_date: "market_date",
  location_country: "location.country",
  location_city: "location.city",
  location_address: "location.address",
  location_coordinates_lat: "location.coordinates.lat",
  location_coordinates_lng: "location.coordinates.lng",
  size_parcelm2: "size.parcel_m2",
  size_grossm2: "size.gross_m2",
  size_netm2: "size.net_m2",
  size_rooms: "size.rooms",
  price_value: "price.value",
  price_currency: "price.currency",
  description: "description",
  title: "title",
  images: "images",
  sold: "sold"
};

<<<<<<< HEAD
router.get('/properties/:pampams?', cors(), async ({ query, params }, res, next) => {
  let { price_min = 0, price_max = Number.MAX_SAFE_INTEGER, order = 'market_date_asc', page = 1, rooms = 0 } = query;
  const limit = 5;
  const offset = (page - 1) * limit;
  const index = order.lastIndexOf('_');
  if (order && order.length < 5 && index === -1) {
    throw new Error(`order param is wrong: ${order}`);
  }
  const order_field = order.slice(0, index);
  const order_direction = order.slice(index + 1);
  console.log(order_field, order_direction);
  if (
    !order_field ||
    !order_direction ||
    !['price_value', 'market_date'].includes(order_field) ||
    !['asc', 'desc'].includes(order_direction)
  ) {
    res.status(400);
    throw new Error(`order param is wrong: ${order}`);
  }
  try {
    let dataQuery = `select * from property`;
    let totalQuery = `select count(id) as total from property`;
    let conditions = [];
    let conditionParams = [];
    if (isNaN(price_min)) {
      res.status(400);
      throw new Error('price_min should be a number');
    } else {
      conditions.push(`price_value >= ?`);
      conditionParams.push(parseInt(price_min));
    }
    if (isNaN(price_max)) {
      res.status(400);
      throw new Error('price_max should be a number');
    } else {
      conditions.push(`price_value <= ?`);
      conditionParams.push(parseInt(price_max));
    }
    if (query.city) {
      conditions.push(`location_city = ?`);
      conditionParams.push(query.city);
    }
    if (query.country) {
      conditions.push(`location_country = ?`);
      conditionParams.push(query.country);
    }
    if (rooms) {
      conditions.push(`size_rooms >= ?`);
      conditionParams.push(rooms);
    }
    if (params.pampams === 'getstatic') {
      await db.queryPromise('select distinct location_country from property');
    }
    if (conditions.length) {
      dataQuery += ' where ';
      dataQuery += conditions.join(' and ');
      totalQuery += ' where ';
      totalQuery += conditions.join(' and ');
    }
    dataQuery += ` order by ${db.escapeId(order_field, true)} ${order_direction} limit ${limit} offset ${offset}`; // params.push(order_field);
    // console.log(dataQuery, totalQuery);
    let totalResult = await db.queryPromise(totalQuery, conditionParams);
    const total = totalResult[0].total;
    let dataResult = await db.queryPromise(dataQuery, conditionParams);
    const data = dataResult;
    let countryCity = await db.queryPromise('select distinct location_city, location_country from property')
    console.log("DOUBLE", countryCity)
    return res.json({ data, total, countryCity});
=======
router.get("/properties", cors(), async (req, res, next) => {
  try {
    const result = await db.queryPromise("select * from `property`;");

    return res.json(result);
>>>>>>> adding client contribute page
  } catch (err) {
    return next(err);
  }
});

<<<<<<< HEAD
router.get('/stats', cors(), (req, res) => {
  res.json({ result: 'GET /api/stats - OK' });
})

const upload = reconizeFileUpload();
router.post('/contribute', upload.single('selectedFile'), async (req, res, next) => {
  try {
    const { url, json, type } = req.body;
    let data;

    switch (type) {
      case 'url':
        data = await fetchJsonURL(url);
        break;
      case 'json':
        data = json;
        break;
      case 'file':
        const xx = req.file.path;

        const myFile = './' + xx;

        const deleteFile = file => {
          fs.unlink(file, err => {
            if (err) throw err;
          });
        };

        setTimeout(() => {
          deleteFile(myFile);
        }, 30 * 6000);

        data = await readJsonFile(myFile);
        break;
      default:
        return next(new Error(`Unsupported type "${type}"`));
    }

    if (!data || !Array.isArray(data) || !data.length) {
      res.status(400);

      throw new Error('Wrong data');
=======
router.get("/stats", cors(), (req, res) => {
  res.json({ result: "GET /api/stats - OK" });
});

const upload = reconizeFileUpload();
router.post(
  "/contribute",
  upload.single("selectedFile"),
  async (req, res, next) => {
    try {
      const { url, json, type } = req.body;
      let data;

      switch (type) {
        case "url":
          data = await fetchJsonURL(url);
          break;
        case "json":
          data = json;
          break;
        case "file":
          const xx = req.file.path;

          const myFile = "./" + xx;

          const deleteFile = file => {
            fs.unlink(file, err => {
              if (err) throw err;
            });
          };

          setTimeout(() => {
            deleteFile(myFile);
          }, 30 * 6000);

          data = await readJsonFile(myFile);
          break;
        default:
          return next(new Error(`Unsupported type "${type}"`));
      }

      if (!data || !Array.isArray(data) || !data.length) {
        res.status(400);

        throw new Error("Wrong data");
      }

      await handleResultsOfPromises(data, res);
    } catch (err) {
      return next(err);
>>>>>>> adding client contribute page
    }

    await handleResultsOfPromises(data, res);
  } catch (err) {
    return next(err);
  }
});

router.use("*", (req, res, next) => {
  return res.status(404).end();
});

module.exports = router;
