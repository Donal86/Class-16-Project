function errorHandler(error, req, res, next) {
  if (res.statusCode === 200) {
    res.status(500);
  }

  res.json({ error: error.message, hee: error });
}

module.exports = errorHandler;
