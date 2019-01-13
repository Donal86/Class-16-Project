const validator = require('validator');
const moment = require('moment');
const currencies = require('./currencies.json');

const parentProperties = [
  'link',
  'location',
  'market_date',
  'price',
  'size',
  'sold'
];

const locationProps = ['city', 'country'];
const coordinatesProps = ['lat', 'lng'];
const priceProps = ['currency', 'value'];
const sizeProps = ['rooms'];

function hasProperties(obj, props) {
    return props.every((el) => obj.hasOwnProperty(el));
}

function hasAllProperties(obj) {
    return hasProperties(obj, parentProperties) && hasProperties(obj.location, locationProps)
    && hasProperties(obj.price, priceProps) && hasProperties(obj.size, sizeProps)
}

function isNumeric(n) {
    return !isNaN(n);
}

function isInteger(n){
    return isNumeric(n) && Number.isInteger(parseFloat(n));
}

function dateValidation(date) {
    const now = moment();

    const test = [
        moment(date, 'DD/MM/YYYY', true),
        moment(date, 'DD-MM-YYYY', true),
        moment(date, 'DD.MM.YYYY', true),
        moment(date, 'MM/DD/YYYY', true),
        moment(date, 'MM-DD-YYYY', true),
        moment(date, 'MM.DD.YYYY', true),
        moment(date, 'YYYY.MM.DD', true),
        moment(date, 'YYYY/MM/DD', true),
        moment(date, 'YYYY-MM-DD', true)
    ];

    return  (moment(date).isValid() && moment(date).isBefore(now))|| test.some((el) => el.isValid() && moment(el).isBefore(now));
}

// Check a valid string like address or country
function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

function validateCurrency(currency){
    return !!currencies[currency];
}

// Check if a vlue number
function checkIfNumber(value) {
    return !isNaN(value) || (isString(value) && !isNaN(value.split(',').join('')));
}

// Validation function
const validation = (obj) => {
  let process = {
    messages: [],
    valid: true,
    raw: obj
  };

  if(!hasAllProperties(obj)) {
    process.messages = ["One or more required's properties is missing!"];
    process.valid = false;
}else {
    const {link, market_date, location, size, price, sold, title, url} = obj;
    process.messages = [];
    if(!validator.isURL(link || url)) {
        process.messages.push('Invalid link');
        process.valid = false;
    }
    if(!dateValidation(market_date)) {
        process.messages.push('Invalid market date');
        process.valid = false;
    }
    if(!isString(location.city)) {
        process.messages.push('Invalid city');
        process.valid = false;
    }
    if(!isString(location.country)) {
        process.messages.push('Invalid country');
        process.valid = false;
    }
    // address or coordinates
    if (!hasProperties(location, ["address"]) && !hasProperties(location, ["coordinates"])) {
            process.messages.push("you don't have any location address or coordinates!");
            process.valid = false;
    }else if(hasProperties(location, ["address"]) && !hasProperties(location, ["coordinates"])){
        if(!isString(location.address)) {
            process.messages.push('Invalid address');
            process.valid = false;
        }
    }else if(!hasProperties(location, ["address"]) && hasProperties(location, ["coordinates"])) {
        if(!hasProperties(location.coordinates, coordinatesProps)) {
            process.messages.push('one of coordinates properties is missing!');
            process.valid = false;
        }
        if(!checkIfNumber(location['coordinates']['lat']) ||
            !checkIfNumber(location['coordinates']['lng'])) {
            process.messages.push('Invalid coordinates value, should be number!');
            process.valid = false;
        }
    }else {
        if(!isString(location.address)) {
            if(!hasProperties(location.coordinates, coordinatesProps)) {
                process.messages.push('No address found! and one of coordinates properties is missing!');
                process.valid = false;
            }else {
                if(!checkIfNumber(location['coordinates']['lat']) ||
                    !checkIfNumber(location['coordinates']['lng'])) {
                    process.messages.push('Invalid coordinates value, should be number!');
                    process.valid = false;
                }
            }
        }
    }
    if(!validateCurrency(price.currency)) {
        process.messages.push('Invalid currency');
        process.valid = false;
    }
    if(!checkIfNumber(price.value)) {
        process.messages.push('Invalid price value , it should be a number');
        process.valid = false;
    }
    if(Number(price.value) === 0) {
        process.messages.push('Invalid price value, cannot be Zero!');
        process.valid = false;
    }

    const sizeProps = ["parcel_m2", "gross_m2", "net_m2"];
    if (!hasProperties(size, ["parcel_m2"]) 
        && !hasProperties(size, ["gross_m2"])
        && !hasProperties(size, ["net_m2"])) {
            process.messages.push("you don't have any area's value!");
            process.valid = false;
    }
    let arrSize = [];
    for(let i=0; i<sizeProps.length; i++) {
        if(size.hasOwnProperty(sizeProps[i])) {
            const cond = checkIfNumber(size[sizeProps[i]]) && Number(size[sizeProps[i]]) > 1;
            arrSize.push(cond);
        }
    }

    const checkSize = arrSize.some(el => el);
    if(!checkSize) {
        process.messages.push('Invalid area, it should be a number');
        process.valid = false;
    }
    if(!checkIfNumber(size.rooms) || Number(size.rooms) < 1) {
        process.messages.push('Invalid rooms value!');
        process.valid = false;
    }
    if(typeof sold !== 'boolean') {
        process.messages.push('Invalid sold , it should be boolean');
        process.valid = false;
    }
    if(!isString(title)) {
        process.messages.push('Invalid title , check the title string!');
        process.valid = false;
    }
}
return process;
};

module.exports = { validation };
