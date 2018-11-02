const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const { generateContractNumber } = require('./helpers');

const {
  ACCOUNT_TYPE: BANK_ACCOUNT_TYPE,
  ACTIVITY: BANK_ACCOUNT_ACTIVITY
} = require('../../bank-account/constants');
const { DAYS_IN_YEAR } = require('../../bank-account/methods/common-operations/constants');
const { RELATED_TRANSITIONS } = require('./constants');


const createCreditWithDependencies = ({ amount, creditProgramId, userId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.createBankAccount(
        { amount, userId, activity: BANK_ACCOUNT_ACTIVITY.ACTIVE, accountType: BANK_ACCOUNT_TYPE.RAW },
        { ...options, transaction }
      ),
      models.BankAccount.createBankAccount(
        { amount: 0, userId, activity: BANK_ACCOUNT_ACTIVITY.ACTIVE, accountType: BANK_ACCOUNT_TYPE.PERCENTAGE },
        { ...options, transaction }
      )
    )
    .spread((rawAccount, percentageAccount) => {
      return models.CreditProgram.fetchById(creditProgramId, { ...options, transaction })
      .then(creditProgram => {
        return generateContractNumber({ transaction })
        .then(contractNumber => {
          const creditContent = {
            amount,
            contractNumber,
            dailyPercentChargeAmount: Number(amount) * creditProgram.percent / 100 / DAYS_IN_YEAR,
            creditProgramId: creditProgram.id,
            rawBankAccountId: rawAccount.id,
            percentageBankAccountId: percentageAccount.id
          };

          return models.Credit.createOne(creditContent, { ...options, transaction })
        })
      });
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


module.exports = {
  createCreditWithDependencies,
  fetchCredits,
  fetchCreditById
};