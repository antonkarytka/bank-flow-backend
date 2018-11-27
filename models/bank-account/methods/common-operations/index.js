const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const {
  AMOUNT_ACTION,
  ALLOWED_AMOUNT_ACTIONS,
  ACTIVITY
} = require('../../../bank-account/constants');


const manipulateBankAccountAmount = (action, content, { clean = false, ...options } = {}) => {
  if (!ALLOWED_AMOUNT_ACTIONS.includes(action)) return Promise.reject(`Could not manipulate bank account's amount. Unrecognized action: ${action}`);

  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchById(content.id, { ...options, transaction }, { strict: true })
    .then(bankAccount => {
      const updated = {};

      if (action === AMOUNT_ACTION.INCREASE) updated.amount = bankAccount.amount + content.amount;
      else if (action === AMOUNT_ACTION.DECREASE) {
        if (bankAccount.amount < content.amount) return Promise.reject(`Could not withdraw money from bank account (${bankAccount.id}): insufficient funds.`);
        updated.amount = bankAccount.amount - content.amount;
      }

      if (!clean) {
        const updatedDebitCredit = recalculateDebitCredit({ amount: content.amount, amountAction: action, bankAccount });
        Object.assign(updated, updatedDebitCredit);
      }

      return models.BankAccount.updateOne({ id: content.id }, updated, { ...options, transaction });
    });
  });
};


function recalculateDebitCredit({ amount, amountAction, bankAccount  }) {
  const updated = {
    credit: 0,
    debit: 0
  };

  if (bankAccount.activity === ACTIVITY.ACTIVE) {
    if (amountAction === AMOUNT_ACTION.INCREASE) updated.debit = bankAccount.debit + amount;
    if (amountAction === AMOUNT_ACTION.DECREASE) updated.credit = bankAccount.credit + amount;
  } else if (bankAccount.activity === ACTIVITY.PASSIVE) {
    if (amountAction === AMOUNT_ACTION.INCREASE) updated.credit = bankAccount.credit + amount;
    if (amountAction === AMOUNT_ACTION.DECREASE) updated.debit = bankAccount.debit + amount;
  }

  return updated;
}


module.exports = {
  manipulateBankAccountAmount
};