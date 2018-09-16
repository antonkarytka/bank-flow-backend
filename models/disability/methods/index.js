const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchDisabilities = (where = {}, options = {}) => {
  /**
   * List Users using `User.fetch()` method. Provide needed `includes` to
   * this method's second parameter.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.Disability.fetch()
    .then(disabilities => ({data: disabilities}));
  });
};


module.exports = {
  fetchDisabilities
};