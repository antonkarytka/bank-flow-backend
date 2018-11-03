const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const generateContractNumber = require('../../../helpers/contract-number');
const { TYPE } = require('../../credit-program/constants');

const {
  ACCOUNT_TYPE: BANK_ACCOUNT_TYPE,
  ACTIVITY: BANK_ACCOUNT_ACTIVITY
} = require('../../bank-account/constants');
const { DAYS_IN_YEAR } = require('../../bank-account/methods/common-operations/constants');
const { RELATED_TRANSITIONS } = require('./constants');

const { manipulateBankAccountAmount } = require('../../bank-account/methods/common-operations');
const { AMOUNT_ACTION } = require('../../bank-account/methods/common-operations/constants');


const createCreditWithDependencies = ({ amount, creditProgramId, userId, endsAt, durationInMonths }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: BANK_ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
      models.BankAccount.createBankAccount(
        { amount, userId, activity: BANK_ACCOUNT_ACTIVITY.ACTIVE, accountType: BANK_ACCOUNT_TYPE.RAW },
        { ...options, transaction }
      ),
      models.BankAccount.createBankAccount(
        { amount: 0, userId, activity: BANK_ACCOUNT_ACTIVITY.ACTIVE, accountType: BANK_ACCOUNT_TYPE.PERCENTAGE },
        { ...options, transaction }
      )
    )
    .spread((developmentFundBankAccount, rawBankAccount, percentageBankAccount) => {
      if (developmentFundBankAccount.amount - amount < 0) return Promise.reject('Not enough money on development fund bank account to provide a credit.');

      return models.CreditProgram.fetchById(creditProgramId, { ...options, transaction })
      .then(creditProgram => {
        return generateContractNumber(models.Credit, { transaction })
        .then(contractNumber => {
          const creditContent = {
            amount,
            residualAmount: amount,
            contractNumber,
            monthlyChargeAmount: getMonthlyChargeAmount(creditProgram, amount, durationInMonths),
            endsAt: endsAt,
            durationInMonths: durationInMonths,
            creditBody: amount / durationInMonths,
            creditProgramId: creditProgram.id,
            rawBankAccountId: rawBankAccount.id,
            percentageBankAccountId: percentageBankAccount.id
          };

          return models.Credit.createOne(creditContent, { ...options, transaction })
        })
      })
      .tap(() => manipulateBankAccountAmount(
        AMOUNT_ACTION.DECREASE,
        { id: developmentFundBankAccount.id, amount },
        { ...options, transaction }
      ))
    })
  });
};

const fetchCredits = (where, options = {}) => {
  return models.Credit.fetch(
    where,
    {
      include: [
        {
          model: models.CreditProgram,
          as: 'creditProgram',
          required: true
        },
        {
          model: models.BankAccount,
          as: 'rawBankAccount',
          required: true
        },
        {
          model: models.BankAccount,
          as: 'percentageBankAccount',
          required: true
        }
      ],
      ...options
    },
  )
};


const fetchCreditById = (where = {}, options = {}) => {
  return models.Credit.fetchById(
    where.creditId,
    {
      include: [
        {
          model: models.CreditProgram,
          as: 'creditProgram',
          required: true
        },
        {
          model: models.BankAccount,
          as: 'rawBankAccount',
          required: true,
          include: RELATED_TRANSITIONS
        },
        {
          model: models.BankAccount,
          as: 'percentageBankAccount',
          required: true,
          include: RELATED_TRANSITIONS
        }
      ],
      ...options
    },
  )
};


const getMonthlyChargeAmount = (creditProgram, amount, durationInMonths) => {
  if (creditProgram.type === TYPE.ANNUITY_PAYMENTS) {
    const monthlyPercent = creditProgram.percent / 12 / 100;
    return (monthlyPercent * (1 + monthlyPercent) ** durationInMonths) / ((1 + monthlyPercent) ** (monthlyPercent - 1));
  } else if(creditProgram.type === TYPE.MONTHLY_PERCENTAGE_PAYMENT) {
    const yearlyPercent = creditProgram.percent / 100;
    return amount * yearlyPercent / DAYS_IN_YEAR * 30;
  }
};


module.exports = {
  createCreditWithDependencies,
  fetchCredits,
  fetchCreditById
};