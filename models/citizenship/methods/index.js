const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchCitizenships = (where = {}, options = {}) => {
  /**
   * List Users using `User.fetch()` method. Provide needed `includes` to
   * this method's second parameter.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.Citizenship.fetch()
    .then(citizenships => ({data: citizenships}));
  });
};


module.exports = {
  fetchCitizenships
};