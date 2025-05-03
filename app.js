const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

const inditexRouter = require('./routes/inditexRoutes');

const app = express();
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
//app.use(mongoSanitize());
//app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', inditexRouter);

module.exports = app;
