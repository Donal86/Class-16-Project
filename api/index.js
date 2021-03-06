const router = require('express').Router();
const cors = require('cors');
const fs = require('fs');
const moment = require('moment');


const {
  readJsonFile,
  fetchJsonURL,
  handleResultsOfPromises,
  reconizeFileUpload,
  createNewDataWithnewCurrencies,
  convertPrice
} = require('../utils/helpers');

const { getCurrencyData } = require('../utils/currencies');

const db = require('../db/')

router.get('/properties/:pampams?', cors(), async ({ query, params, headers }, res, next) => {
  const currencyData = getCurrencyData();

  let {
    price_min = 0,
    price_max = Number.MAX_SAFE_INTEGER,
    order = 'market_date_asc',
    page = 1,
    rooms = 0,
    map = 0
  } = query;

  let currency = query.currency || headers.currency || 'EUR';

  const ITEMS_PER_PAGE = 20;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const index = order.lastIndexOf('_');
  if (order && order.length < 5 && index === -1) {
    throw new Error(`order param is wrong: ${order}`);
  }
  const order_field = order.slice(0, index);
  const order_direction = order.slice(index + 1);

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
      // conditions.push(`price_value >= ?`);
      // conditionParams.push(parseInt(price_min));
    }
    if (isNaN(price_max)) {
      res.status(400);
      throw new Error('price_max should be a number');
    } else {
      // conditions.push(`price_value <= ?`);
      // conditionParams.push(parseInt(price_max));
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

    if (conditions.length) {
      dataQuery += ' where ';
      dataQuery += conditions.join(' and ');
      totalQuery += ' where ';
      totalQuery += conditions.join(' and ');
    }

    // dataQuery += ` order by ${db.escapeId(order_field, true)} ${order_direction} limit ${limit} offset ${offset}`; // params.push(order_field);
    dataQuery += ` order by ${db.escapeId(order_field, true)} ${order_direction}`; // params.push(order_field);

    // let totalResult = await db.queryPromise(totalQuery, conditionParams);
    // const total = totalResult[0].total;

    let dataResult = await db.queryPromise(dataQuery, conditionParams);

    try {
      for (const h of dataResult) {
        const converted = convertPrice(h.price_value, h.price_currency, currency)
        h.price_value_converted = converted;
      }
    } catch (e) {
      return next(e);
    }

    let data = dataResult.filter(p => {
      return (
        p.price_value_converted &&
        p.price_value_converted >= price_min &&
        p.price_value_converted <= price_max
      );
    })

    const total = data.length;

    if (!map) {
      data = data.slice(offset, offset + ITEMS_PER_PAGE);
    }

    let countryCity = await db.queryPromise('select distinct location_city, location_country from property')

    return res.json({ data, total, countryCity });
  } catch (err) {
    return next(err)
  }
})

router.get('/city-name', cors(), async (req, res, next) => {
  try {
    const sql = `select city from city_status group by city order by city ASC;`
    const result = await db.queryPromise(sql);
    if (!result.length) {
      res.status(404).json(result);
    }
    else return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.get('/stats', cors(), async (req, res, next) => {
  try {
    const city = req.query.city || null;
    let currency = req.query.currency || req.headers.currency || 'EUR';

    const sql = `
      SELECT 
        *, 
        sum(total_price) / sum(total_count) AS averagePrice, 
        sum(total_price ) /sum(total_m2) AS avgSqr 
      FROM city_status 
      WHERE 
        market_date >= ? and market_date <= ?
        ${city ? ' and city = ?' : ''}
      GROUP BY market_date
    `;

    const d1 = moment().subtract(20, 'd').format('YYYY-MM-DD');
    const d2 = moment().format('YYYY-MM-DD');

    const result = await db.queryPromise(sql, [d1, d2, city]);

    for (const stat of result) {
      const converted = convertPrice(stat.averagePrice, 'EUR', currency)
      stat.price_value_converted = converted;
    }

    res.json(result)

  } catch (error) {
    return next(error);
  }
});

const upload = reconizeFileUpload()
router.post(
  '/contribute',
  upload.single('selectedFile'),
  async (req, res, next) => {
    try {
      const { url, json, type } = req.body
      let data

      switch (type) {
        case 'url':
          data = await fetchJsonURL(url)
          break
        case 'json':
          data = JSON.parse(json);
          break;
        case 'file':
          const xx = req.file.path

          const myFile = './' + xx

          const deleteFile = file => {
            fs.unlink(file, err => {
              if (err) throw err
            })
          }

          setTimeout(() => {
            deleteFile(myFile)
          }, 30 * 6000)

          data = await readJsonFile(myFile);
          break;
        default:
          return next(new Error(`Unsupported type "${type}"`))
      }

      if (!data || !Array.isArray(data) || !data.length) {
        res.status(400)

        throw new Error('Wrong data')
      }

      await handleResultsOfPromises(data, res)
    } catch (err) {
      return next(err)
    }
  }
)

router.get('/house', cors(), async ({ query, headers }, res, next) => {
  try {
    const { id } = query;

    let currency = query.currency || headers.currency || 'EUR';

    const result = await db.queryPromise(
      `SELECT * FROM property WHERE id = ?`,
      [id]
    )

    for (const h of result) {
      const converted = convertPrice(h.price_value, h.price_currency, currency)
      h.price_value_converted = converted;
    }

    if (result.length < 1) {
      res.json({ message: 'wrong house id' })
    } else return res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.use('*', (req, res, next) => {
  return res.status(404).end()
})

module.exports = router;
