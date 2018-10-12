const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../../constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE } } = require('../common-operations/constants');
const { manipulateBankAccountAmount } = require('../common-operations');

const putMoneyOnCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(INCREASE, { ...content, id: cashboxAccount.id }, { ...options, transaction }));
  });
};

const transferMoneyToRawAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return manipulateBankAccountAmount(DECREASE, { ...content, id: cashboxAccount.id }, { ...options, transaction })
      .then(() => manipulateBankAccountAmount(INCREASE, { ...content, id: content.id}, { ...options, transaction }));
    });
  });
};

module.exports = {
  putMoneyOnCashbox,
  transferMoneyToRawAccount
};