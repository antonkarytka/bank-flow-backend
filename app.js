const express = require("express");
const cookieParser = require("cookie-parser");

const router = require("./routes");
const parseQueryObject = require("./helpers/query-object-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.query && req.query.where)
    req.query = { ...req.query, where: parseQueryObject(req.query.where) };

  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  next();
});

app.use(router);

module.exports = app;
