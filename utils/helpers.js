const uuidv4 = require("uuid/v4");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const multer = require("multer");
const db = require("../db/");
const readyCurrencyData = require("../utils/currenciesOfToday.json");

const { validation } = require("./validateProperty");
const { normalization } = require("./normalizeProperty");

function housesArrayProduce(houses) {
  let qurArr = [];
  houses.forEach((house, i) => {
    const {
      link,
      market_date,
      location,
      size,
      price,
      images,
      description,
      title,
      sold
    } = house;
    const marketDate = new Date(market_date);
    const strImg = images.join();
    const parcel_m2 = size.parcel_m2 || null;
    const gross_m2 = size.gross_m2 || null;
    const net_m2 = size.net_m2 || null;
    qurArr[i] = [
      link,
      marketDate,
      location.country,
      location.city,
      location.address,
      location.coordinates.lat,
      location.coordinates.lng,
      parcel_m2,
      gross_m2,
      net_m2,
      size.rooms,
      price.value,
      price.currency,
      description,
      title,
      strImg,
      sold
    ];
  });
  return qurArr;
}

// status table &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

function extractCities(houses) {
  const citiesArr = houses.map((el) => el.location_city);
  const cities = citiesArr.filter(function (item, pos) {
    return citiesArr.indexOf(item) == pos;
  });
  return cities;
}

function extractDatesOfCity(datesArr) {
  let uniqueDates = datesArr
    .map(s => s.toString())
    .filter((s, i, a) => a.indexOf(s) == i)
    .map(s => new Date(s));
  return uniqueDates;
}

function getOneCityStatus(city, marketDate, houses) {
  let status = {
    city: "",
    marketDate: "",
    id: "",
    city: "",
    marketDate: "",
    totalPrice: 0,
    totalCount: 0,
    totalM2: 0
  };
  status.city = city;
  status.marketDate = marketDate;
  let price = 0;
  let area = 0;
  houses.forEach((house, i) => {
    const myDate = new Date(house.market_date);
    if (Date.parse(myDate) === Date.parse(marketDate) && house.location_city === city) {
      status.totalCount += 1;
      price += Number(house.price_value);
      price = price.toFixed(2);
      price = Number(price);
      status.totalPrice = price;
      if (house.size_grossm2) {
        area += Number(house.size_grossm2);
      } else if (house.size_netm2) {
        area += Number(house.size_netm2);
      } else area += Number(house.size_parcelm2);

      area = area.toFixed(2);
      area = Number(area);
      status.totalM2 = area;
    }
  });
  return status;
}

function getDatesOfCity(city, houses) {
  let allDates = [];
  houses.forEach(house => {
    if (house.location_city === city) {
      allDates.push(house.market_date);
    }
  });
  const datesUq = extractDatesOfCity(allDates);
  return datesUq;
}

function getAllCitiesStatus(houses) {
  let citiesStatus = [];
  const cities = extractCities(houses);
  cities.forEach(city => {
    const uniqueDates = getDatesOfCity(city, houses);
    uniqueDates.forEach(uqDate => {
      citiesStatus.push(getOneCityStatus(city, uqDate, houses));
    });
  });
  return citiesStatus;
}

function statusTable(houses) {
  let qurArray = [];
  const citiesStatus = getAllCitiesStatus(houses);
  citiesStatus.forEach((place, i) => {
    const { city, marketDate, totalPrice, totalCount, totalM2 } = place;
    qurArray[i] = [city, marketDate, totalPrice, totalCount, totalM2];
  });
  return qurArray;
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%
async function insertIntoDatabase(report, houses) {
  try {
    if (houses.length) {
      let storeHousesQuery =
        "REPLACE INTO property (link, market_date, location_country, location_city, location_address, location_coordinates_lat,";

      storeHousesQuery +=
        " location_coordinates_lng, size_parcelm2, size_grossm2, size_netm2, size_rooms, price_value, price_currency, description,";
      storeHousesQuery += "title, images, sold) VALUES ?";

      if (houses.length >= 1) {
        await db.queryPromise(storeHousesQuery, [houses]);
      }
    }

    return {
      insertedItems: houses.length,
      errors: report.errReport.length,
      errMessages: report.errReport
    };
  } catch (err) {
    throw err;
  }
}

async function insertDataIntoStatus(data) {
  try {
    const statusQuery =
      'REPLACE INTO city_status (city, market_date, total_price, total_count, total_m2) VALUES ?';
    if (data.length >= 1) {
      await db.queryPromise(statusQuery, [data]);
    }
  }
  catch (err) {
    throw err;
  }
}

function isEmptyObject(obj) {
  return !obj || Object.keys(obj).length === 0;
}

function loopInValidation(data) {
  const result = {};
  let final = [];
  let err = [];
  if (Array.isArray(data)) {
    data.forEach((el, i) => {
      let process = validation(el);
      if (process.valid) final.push(el);
      else {
        const report = {
          messages: process.messages,
          raw: el
        };
        err.push(report);
      }
    });
    result.validItems = final;
    result.errReport = err;
  } else {
    let process = validation(data);
    if (process.valid) final.push(data);
    else {
      const report = {
        messages: process.messages
      };
      err.push(report);
    }
    result.validItems = final;
    result.errReport = err;
  }
  return result;
}

function loopInNormalization(data) {
  let filterdData = [];
  data.forEach(el => {
    const item = normalization(el);
    filterdData.push(item);
  });
  return filterdData;
}

function fetchJsonURL(url) {
  return fetch(url).then(response => response.json());
}

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const fileContent = JSON.parse(data);
        resolve(fileContent);
      }
    });
  });
}

async function handleResultsOfPromises(data, res) {
  const report = loopInValidation(data);
  const filterdData = loopInNormalization(report.validItems);
  const houses = housesArrayProduce(filterdData);
  //const cityStatus = statusArray(filterdData);
  const responseResult = await insertIntoDatabase(report, houses);

  const getHouses = 'SELECT * FROM `property`;';
  const currentData = await db.queryPromise(getHouses);
  const citiesStatus = statusTable(currentData);
  await insertDataIntoStatus(citiesStatus);

  return res.json(responseResult);
}

function reconizeFileUpload() {
  if (!fs.existsSync("./uploaded-files")) {
    fs.mkdirSync("./uploaded-files");
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploaded-files");
    },
    filename: (req, file, cb) => {
      const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    }
  });
  // create the multer instance that will be used to upload/save the file
  const upload = multer({ storage });
  return upload;
}

function isTheDateTodayChecker() {
  const oldDate = new Date(readyCurrencyData.date).toDateString();
  const today = new Date().toDateString();
  const datesAreSame = today === oldDate;
  return datesAreSame;
}

async function currencyDataFetcher() {
  if (isTheDateTodayChecker() === false) {
    await fetch("https://api.openrates.io/latest")
      .then(res => res.json())
      .then(data => {
        data["date"] = new Date().toDateString();
        data.rates["EUR"] = 1;
        fs.writeFile(
          "./utils/currenciesOfToday.json",
          JSON.stringify(data),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The new data of currency rates has fetched succesfully.");
          }
        );
      })
      .catch(err => {
        throw err;
      });
  } else {
    console.log("The data of currency rates has fetched today once, you are using former data");
  }
}

async function createNewDataWithnewCurrencies(result, currency) {
  await currencyDataFetcher();

  result.forEach(x => {
    const rates = readyCurrencyData.rates
    x.price_value = Number((x.price_value * rates[currency] / rates[x.price_currency]).toFixed(2));
    x.price_currency = currency
  });
  return result;
}

module.exports = {
  housesArrayProduce,
  insertIntoDatabase,
  readJsonFile,
  fetchJsonURL,
  loopInNormalization,
  loopInValidation,
  isEmptyObject,
  handleResultsOfPromises,
  reconizeFileUpload,
  createNewDataWithnewCurrencies
};
