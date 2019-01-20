function errorHandler(error, req, res, next) {
  console.log(error);

  if (res.statusCode === 200) {
    res.status(500)
  }

  res.json({ error: error.message })
}

module.exports = errorHandler
