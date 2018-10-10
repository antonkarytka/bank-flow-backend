const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../constants');
const { increaseAmount, decreaseAmount } = require('./common-operations');

const putMoneyOnCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return increaseAmount({ ...content, id: cashboxAccount.id }, { ...options, transaction });
    });
  });
};

const transferMoneyToRawAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return decreaseAmount({ ...content, id: cashboxAccount.id }, { ...options, transaction })
      .then(result => {
        return increaseAmount({ ...content, id: content.id}, { ...options, transaction });
      });
    });
  });
};

module.exports = {
  putMoneyOnCashbox,
  transferMoneyToRawAccount
};