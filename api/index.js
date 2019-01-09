const router = require('express').Router();
const cors = require('cors');

const {
  readJsonFile,
  fetchJsonURL,
  handleResultsOfPromises,
  reconizeFileUpload
} = require('../utils/helpers');

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
    if (result.length < 1)
      return res.status(301).json({ message: 'There are no houses!' });
    else return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

router.get('/stats', cors(), (req, res) => {
  res.json({ result: 'GET /api/stats - OK' });
});

const upload = reconizeFileUpload();
router.post(
  '/contribute',
  upload.single('selectedFile'),
  async (req, res, next) => {
    const { link, jsonData, type } = req.body;
    if (req.body && type === 'url') {
      fetchJsonURL(link)
        .then((data) => handleResultsOfPromises(data, res))
        .catch((err) => res.status(404).json({ invalidJson: err }));
    } else if (type === 'file') {
      const xx = req.file.path;
      console.log('heeey', req.file);
      const myFile = './' + xx;

      const deleteFile = (file) => {
        fs.unlink(file, (err) => {
          if (err) throw err;
        });
      };
      setTimeout(() => {
        deleteFile(myFile);
      }, 30 * 6000);
      readJsonFile(file)
        .then((data) => {
          const myData = JSON.parse(data);
          return handleResultsOfPromises(myData, res);
        })
        .catch((err) => res.status(404).json({ invalidJson: err }));
    }

    // 9998989898989898989898989898989898989898989
    else if (req.body && type === 'jsonData') {
      //const items = JSON.parse(jsonData);
      const items = [jsonData];
      if (!items || !Array.isArray(items)) {
        return res.status(400).send('invalid data');
      }
      return handleResultsOfPromises(items, res);

      // const columns = Object.keys(columnsMap);

      // const data = items.map(item => {
      //   return columns.map(column => get(item, columnsMap[column]));
      // })

      // const sql = `replace into \`property\` (${columns}) values ?;`;
      // const params = [data];

      // try {
      //   await db.queryPromise(sql, params);

      //   res.json({
      //     result: 'POST /api/contribute - OK',
      //     items: items.length
      //   });
      // } catch (err) {
      //   return next(err);
      // }
    }
  }
);

router.use('*', (req, res, next) => {
  res.status(404).send('404');
});

module.exports = router;
