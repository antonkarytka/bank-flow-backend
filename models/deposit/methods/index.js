const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;


const createDepositWithDependencies = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.createOne(content, { ...options, transaction })
    .then(deposit => {
      content.depositId = deposit.id;
      return Promise.all([
        models.BankAccount.createRawCashBankAccount(content, { ...options, transaction }),
        models.BankAccount.createPercentBankAccount(content, { ...options, transaction }),
      ]);
    });
  });
};

module.exports = {
  createDepositWithDependencies
};