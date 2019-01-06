const router = require('express').Router();
const cors = require('cors');

const db = require('../db/');

const columnsMap = {
  link: 'link',
  market_date: 'market_date',
  location_country: 'location.country',
  location_city: 'location.city',
  location_address: 'location.address',
  location_coordinates_lat: 'location.coordinates.lat',
  location_coordinates_lng: 'location.coordinates.lng',
  size_parcelm2: 'size.parcel_m2',
  size_grossm2: 'size.gross_m2',
  size_netm2: 'size.net_m2',
  size_rooms: 'size.rooms',
  price_value: 'price.value',
  price_currency: 'price.currency',
  description: 'description',
  title: 'title',
  images: 'images',
  sold: 'sold'
};

router.get('/properties', cors(), async (req, res, next) => {
  try {
    const result = await db.queryPromise('select * from `property`;');
    res.json(result);
  } catch (err) {
    return next(err);
  }
});

router.get('/stats', cors(), (req, res) => {
  res.json({ result: 'GET /api/stats - OK' });
});

router.post('/contribute', async (req, res, next) => {
  const items = JSON.parse(req.body.data);

  if (!items || !Array.isArray(items)) {
    throw new Error('Invalid data');
  }

  const columns = Object.keys(columnsMap);

  const data = items.map((item) => {
    return columns.map((column) => get(item, columnsMap[column]));
  });

  const sql = `replace into \`property\` (${columns}) values ?;`;
  const params = [data];

  try {
    await db.queryPromise(sql, params);

    res.json({
      result: 'POST /api/contribute - OK',
      items: items.length
    });
  } catch (err) {
    return next(err);
  }
});

router.use('*', (req, res, next) => {
  res.status(404).send('404');
});

module.exports = router;
