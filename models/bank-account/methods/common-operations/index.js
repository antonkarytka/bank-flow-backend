const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;
const { ACTIVITY } = require('../../constants');
const { AMOUNT_ACTION, ALLOWED_AMOUNT_ACTIONS } = require('./constants');


const manipulateBankAccountAmount = (action, content, options = {}) => {
  if (!ALLOWED_AMOUNT_ACTIONS.includes(action)) return Promise.reject(`Could not manipulate bank account's amount. Unrecognized action: ${action}`);

  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchById(content.id, { ...options, transaction })
    .then(bankAccount => {
      const updatedContent = {};
      if (action === AMOUNT_ACTION.INCREASE) {
        updatedContent.amount = bankAccount.amount + content.amount
      } else if (action === AMOUNT_ACTION.DECREASE) {
        updatedContent.amount = bankAccount.amount - content.amount
      }
      updateBankAccountContent({ content, updated: updatedContent, bankAccount, amountAction: action });

      return models.BankAccount.updateOne({ id: content.id }, updatedContent, { ...options, transaction });
    });
  });
};



function updateBankAccountContent({ content, updated, bankAccount, amountAction }) {
  if (bankAccount.activity === ACTIVITY.ACTIVE) {
    if (amountAction === AMOUNT_ACTION.INCREASE) updated.debit = bankAccount.debit + content.amount;
    if (amountAction === AMOUNT_ACTION.DECREASE) updated.credit = bankAccount.credit + content.amount;
  } else if (bankAccount.activity === ACTIVITY.PASSIVE) {
    if (amountAction === AMOUNT_ACTION.INCREASE) updated.credit = bankAccount.credit + content.amount;
    if (amountAction === AMOUNT_ACTION.DECREASE) updated.debit = bankAccount.debit + content.amount;
  }

  return updated;
}

module.exports = {
  manipulateBankAccountAmount
};