const router = require("express").Router();
const cors = require("cors");

const db = require("../db/");

router.get("/properties", cors(), (req, res) => {
  res.json({ result: "GET /api/properties - OK" });
});

router.get("/stats", cors(), (req, res) => {
  res.json({ result: "GET /api/stats - OK" });
});

router.post("/contribute", (req, res) => {
  let items;

  switch (req.headers["content-type"]) {
    case 'application/json':
      items = req.body;
      break;
    case 'application/x-www-form-urlencoded':
      items = JSON.parse(req.body.data);
      break;
    default:
      throw new Error('Wrong content type ' + req.headers["content-type"]);
  }

  if (!items || !Array.isArray(items)) {
    throw new Error('Invalid data');
  }

  res.json({
    result: "POST /api/contribute - OK",
    items: items.length
  });
});

router.use("*", (req, res, next) => {
  res.status(404).send("404");
});

module.exports = router;
