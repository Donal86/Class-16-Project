require('dotenv').load();

const db = require('./db');
const app = require('./app');
const { fetchCurrencies } = require('./utils/currencies');

db.connect(async (err) => {
  if (err) {
    throw err;
  }

  try {
    await fetchCurrencies();

    app.listen(process.env.PORT, () => {
      console.log(
        `db is up, app is running at http://localhost:${process.env.PORT}`
      );
    });
  } catch (err) {
    console.log(err);
  }
});
