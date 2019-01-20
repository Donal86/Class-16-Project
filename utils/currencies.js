const axios = require('axios');

const SUPPORTED_CURRENCIES = [
  {
    code: 'EUR',
  },
  {
    code: 'USD',
  },
  {
    code: 'GBP',
  }
];

const currencyData = {};

async function fetchCurrencies() {

  for (let { code } of SUPPORTED_CURRENCIES) {
    const url = `https://api.exchangeratesapi.io/latest?base=${code}`;

    try {
      const response = await axios.get(url);

      if (response.data.error) {

      } else {
        currencyData[code] = response.data;
        Object.freeze(currencyData[code])
      }

    } catch (e) {
      if (e.response) {
        // console.log(e.response.status);
      } else {
        // console.log(e);
      }
    }
  }

  if (!Object.keys(currencyData).length) {
    throw new Error('server failed to load currencies');
  }

  Object.freeze(currencyData);
}

const getCurrencyData = () => currencyData;

module.exports = {
  fetchCurrencies,
  getCurrencyData
}