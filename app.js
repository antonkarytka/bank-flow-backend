const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const router = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});

app.use(router);


process.on('uncaughtException', err => {
  console.log('--- Uncaught Exception ---');
  console.log('Error: ', err);
  console.log('History:', err.history);
  console.log('Stack:', err.stack);
});

process.on('unhandledRejection', err => {
  console.log('--- Unhandled Rejection ---');
  console.log('Error: ', err);
  console.log('SQL: ', err.sql);
  console.log('History: ', err.history);
  console.log('Stack: ', err.stack);
});


module.exports = app;
