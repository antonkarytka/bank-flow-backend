const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchCities = (where = {}, options = {}) => {
  /**
   * List Users using `User.fetch()` method. Provide needed `includes` to
   * this method's second parameter.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.City.fetch()
    .then(cities => ({data: cities}));
  });
};


module.exports = {
  fetchCities
};