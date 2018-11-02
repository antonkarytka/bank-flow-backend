const models = require('../../index');
const { sequelize } = models;

const fetchCreditPrograms = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  fetchCreditPrograms
};