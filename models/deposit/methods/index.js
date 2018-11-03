const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const generateContractNumber = require('../../../helpers/contract-number');

const {
  ACCOUNT_TYPE: BANK_ACCOUNT_TYPE,
  ACTIVITY: BANK_ACCOUNT_ACTIVITY
} = require('../../../helpers/common-constants/constants');
const { DAYS_IN_YEAR } = require('../../../helpers/common-constants/constants');
const { RELATED_TRANSITIONS } = require('./constants');


const createDepositWithDependencies = ({ amount, depositProgramId, userId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.createBankAccount(
        { amount, userId, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.RAW },
        { ...options, transaction }
      ),
      models.BankAccount.createBankAccount(
        { amount: 0, userId, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.PERCENTAGE },
        { ...options, transaction }
      )
    )
    .spread((rawAccount, percentageAccount) => {
      return models.DepositProgram.fetchById(depositProgramId, { ...options, transaction })
      .then(depositProgram => {
        return generateContractNumber(models.Deposit, { transaction })
        .then(contractNumber => {
          const depositContent = {
            amount,
            contractNumber,
            dailyPercentChargeAmount: Number(amount) * depositProgram.percent / 100 / DAYS_IN_YEAR,
            depositProgramId: depositProgram.id,
            rawBankAccountId: rawAccount.id,
            percentageBankAccountId: percentageAccount.id
          };

          return models.Deposit.createOne(depositContent, { ...options, transaction })
        })
      });
    })
  });
};


const fetchDeposits = (where, options = {}) => {
  return models.Deposit.fetch(
    where,
    {
      include: [
        {
          model: models.DepositProgram,
          as: 'depositProgram',
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


const fetchDepositById = (where = {}, options = {}) => {
  return models.Deposit.fetchById(
    where.depositId,
    {
      include: [
        {
          model: models.DepositProgram,
          as: 'depositProgram',
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
  createDepositWithDependencies,
  fetchDeposits,
  fetchDepositById
};