const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const { ACTIVITY, ACCOUNT_TYPE} = require('../constants');


const createRawCashBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const bankAccountContent = {
      ...content,
      account_type: ACCOUNT_TYPE.RAW
    };
    return createPassiveBankAccount(bankAccountContent, { ...options, transaction});
  });
};

const createPercentBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const bankAccountContent = {
      ...content,
      account_type: ACCOUNT_TYPE.PERCENT
    };
    return createPassiveBankAccount(bankAccountContent, { ...options, transaction});
  });
};

const createPassiveBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const passiveBankAccountContent = {
      ...content,
      activity: ACTIVITY.PASSIVE
    };
    return createBankAccount(passiveBankAccountContent, { ...options, transaction});
  });
};

const createBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const bankAccountContent = {
      ...content,
      number: Math.floor(Math.random() * (1000 - 1)) + 1, //TODO: Replace with real number
      numberCode: Math.floor(Math.random() * (1000 - 1)) + 1, //TODO: Replace with real number
      debit: 0,
      credit: 0,
      remainder: 0,
      name: 'tempName', //TODO: Replace with real name
    };
    return models.BankAccount.createOne(bankAccountContent, { ...options, transaction});
  });
};

module.exports = {
  createRawCashBankAccount,
  createPercentBankAccount,
};