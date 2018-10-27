const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;


const createTransitionWithDependencies = (updateBankAccounts, content = {}, options = {}) => {
  if (!updateBankAccounts) return Promise.reject('Method for manipulating bank accounts must be provided as first parameter.');

  return sequelize.continueTransaction(options, transaction => {
    return Promise.resolve(updateBankAccounts(content, { ...options, transaction }))
    .then(({ senderBankAccountId, receiverBankAccountId, amount } = {}) =>
      models.Transition.createOne({ senderBankAccountId, receiverBankAccountId, amount }, { transaction })
    )
  });
};

const fetchTransitions = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Transition.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  createTransitionWithDependencies,
  fetchTransitions
};