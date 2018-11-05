const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;
const { Op } = sequelize;

const {
  AMOUNT_ACTION,
  ALLOWED_AMOUNT_ACTIONS,
  ACTIVITY
} = require('../../../bank-account/constants');
const { TYPE: CREDIT_PROGRAM_TYPE } = require('../../../credit-program/constants');
const { DAYS_IN_YEAR } = require('../../../../constants');


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


const simulateMonthChanging = (content = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      changeMonthlyPercentagePaymentCreditState(content, { ...options, transaction }),
      changeAnnuityCreditState(content, { ...options, transaction})
    )
    .then(() => Promise.resolve('Month has been successfully changed.'));
  });
};


const changeMonthlyPercentagePaymentCreditState = (content = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch({ type: CREDIT_PROGRAM_TYPE.MONTHLY_PERCENTAGE_PAYMENT }, { ...options, transaction })
    .then(creditPrograms => {
      return models.Credit.fetch(
        { creditProgramId: { [Op.in]: creditPrograms.map(program => program.id) } },
        {
          ...options,
          include: [{
            model: models.CreditProgram,
            as: 'creditProgram',
            required: true
          }],
          transaction
        }
      )
      .then(credits => Promise.map(credits, credit => {
        const newResidualMonthlyPaymentAmount = credit.residualMonthlyPaymentAmount - credit.creditBody;

        return models.Credit.updateOne(
          { id: credit.id },
          {
            monthlyChargeAmount: newResidualMonthlyPaymentAmount * (credit.creditProgram.percent / 100) / DAYS_IN_YEAR * 30 + credit.creditBody,
            residualAmount: credit.residualAmount - credit.monthlyChargeAmount,
            residualMonthlyPaymentAmount: newResidualMonthlyPaymentAmount
          },
          { ...options, transaction }
        )
      }));
    });
  });
};


const changeAnnuityCreditState = (content = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch({ type: CREDIT_PROGRAM_TYPE.ANNUITY_PAYMENTS }, { ...options, transaction })
    .then(creditPrograms => {
      return models.Credit.fetch(
        { creditProgramId: { [Op.in]: creditPrograms.map(program => program.id) } },
        {
          ...options,
          include: [{
            model: models.CreditProgram,
            as: 'creditProgram',
            required: true
          }],
          transaction
        }
      )
      .then(credits => Promise.map(credits, credit => models.Credit.updateOne(
        { id: credit.id },
        { residualAmount: credit.residualAmount - credit.monthlyChargeAmount },
        { ...options, transaction }
      )));
    });
  });
};


module.exports = {
  manipulateBankAccountAmount,
  simulateMonthChanging
};