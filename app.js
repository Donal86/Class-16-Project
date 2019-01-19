const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api', require('./api'));

// Use folder ./public/ for development
if (process.env.STAGE === 'dev') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
  });
}
// Use folder ./client/build/ for production
if (process.env.STAGE === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/build/index.html')));
}

app.use(require('./utils/errorHandler'));

module.exports = app;
