const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchDisabilities = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Disability.fetch(where, {...options, transaction});
  });
};


module.exports = {
  fetchDisabilities
};