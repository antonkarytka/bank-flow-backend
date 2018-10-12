const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchCities = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.City.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  fetchCities
};