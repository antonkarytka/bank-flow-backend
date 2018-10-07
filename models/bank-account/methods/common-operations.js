const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const { ACTIVITY } = require('../constants');

const increaseAmount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ id: content.id }, { ...options, transaction })
    .then(bankAccount => {
      let updatedContent = {
        amount: bankAccount.amount + content.amount
      };

      if (bankAccount.activity === ACTIVITY.ACTIVE) {
        updatedContent.debit = bankAccount.debit + content.amount;
      } else if (bankAccount.activity === ACTIVITY.PASSIVE) {
        updatedContent.credit = bankAccount.credit + content.amount;
      }

      return models.BankAccount.updateOne({ id: content.id }, { ...updatedContent }, { ...options, transaction });
    });
  });
};

const decreaseAmount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ id: content.id }, { ...options, transaction })
    .then(bankAccount => {
      let updatedContent = {
        amount: bankAccount.amount - content.amount
      };

      if (bankAccount.activity === ACTIVITY.ACTIVE) {
        updatedContent.credit = bankAccount.credit + content.amount;
      } else if (bankAccount.activity === ACTIVITY.PASSIVE) {
        updatedContent.debit = bankAccount.debit + content.amount;
      }

      return models.BankAccount.updateOne({ id: content.id }, { ...updatedContent }, { ...options, transaction });
    });
  });
};

module.exports = {
  increaseAmount,
  decreaseAmount
};