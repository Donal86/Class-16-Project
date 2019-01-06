const router = require('express').Router();
const cors = require('cors');

const db = require('../db/');

router.get('/properties', cors(), (req, res) => {
  res.json({result: 'GET /api/properties - OK'});
});

router.get('/stats', cors(), (req, res) => {
  res.json({result: 'GET /api/stats - OK'});
});

router.post('/contribute', (req, res) => {
  const items = JSON.parse(req.body.data);

  if (!items || !Array.isArray(items)) {
    return res.status(400).send('invalid data');
  }

  res.json({
    result: 'POST /api/contribute - OK',
    items: items.length
  });
});

router.use('*', (req, res, next) => {
  res.status(404).send('404');
})

module.exports = router;