const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const { ACTIVITY } = require('../constants');


const createPassiveBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const bankAccountContent = {
      ...content,
      number: 1234, //TODO: Replace with real number
      numberCode: 1234, //TODO: Replace with real number
      activity: ACTIVITY.PASSIVE,
      debit: 0,
      credit: 0,
      remainder: 0,
      name: 'tempName', //TODO: Replace with real name
    };
    return models.BankAccount.createOne(bankAccountContent, { ...options, transaction});
  });
};

module.exports = {
  createPassiveBankAccount
};