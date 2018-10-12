const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const {
  ACCOUNT_TYPE: BANK_ACCOUNT_TYPE,
  ACTIVITY: BANK_ACCOUNT_ACTIVITY
} = require('../../bank-account/constants');

const createDepositWithDependencies = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.createOne(content, { ...options, transaction })
    .tap(deposit => {
      content.depositId = deposit.id;
      return Promise.all([
        models.BankAccount.createBankAccount(
          { ...content, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.RAW },
          { ...options, transaction }
        ),
        models.BankAccount.createBankAccount(
          { ...content, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.PERCENT },
          { ...options, transaction }
        ),
      ]);
    });
  });
};

module.exports = {
  createDepositWithDependencies
};