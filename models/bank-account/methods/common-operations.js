const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const { ACTIVITY } = require('../constants');

const ACTION = {
  INCREASE: 'increase',
  DECREASE: 'decrease'
};

const ALLOWED_ACTIONS = Object.values(ACTION);


const manipulateBankAccountAmount = (action, content, options = {}) => {
  if (!ALLOWED_ACTIONS.includes(action)) return Promise.reject(`Could not manipulate bank account's amount. Unrecognized action: ${action}`);

  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchById(content.id, { ...options, transaction })
      .then(bankAccount => {
        const updatedContent = {
          amount: bankAccount.amount + content.amount
        };

        updateBankAccountContent({ content, updated: updatedContent, bankAccount, amountAction: action });

        return models.BankAccount.updateOne({ id: content.id }, updatedContent, { ...options, transaction });
      });
  });
};



function updateBankAccountContent({ content, updated, bankAccount, amountAction }) {
  if (bankAccount.activity === ACTIVITY.ACTIVE) {
    if (amountAction === ACTION.INCREASE) updated.debit = bankAccount.debit + content.amount;
    if (amountAction === ACTION.DECREASE) updated.credit = bankAccount.credit + content.amount;
  } else if (bankAccount.activity === ACTIVITY.PASSIVE) {
    if (amountAction === ACTION.INCREASE) updated.credit = bankAccount.credit + content.amount;
    if (amountAction === ACTION.DECREASE) updated.debit = bankAccount.debit + content.amount;
  }

  return updated;
}

module.exports = {
  manipulateBankAccountAmount,
  increaseAmount,
  decreaseAmount
};