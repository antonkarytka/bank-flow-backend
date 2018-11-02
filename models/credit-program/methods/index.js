const models = require('../../index');
const { sequelize } = models;

const fetchDepositPrograms = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  fetchDepositPrograms
};