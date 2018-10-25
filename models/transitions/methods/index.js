const models = require('../../index');
const { sequelize } = models;

const fetchTransitions = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Transition.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  fetchTransitions
};