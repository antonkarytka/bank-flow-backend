const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchDepositTypes = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.DepositType.fetch(where, {...options, transaction});
  });
};


module.exports = {
  fetchDepositTypes
};