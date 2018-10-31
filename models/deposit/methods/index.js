const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;
const { generateContractNumber } = require('./helpers');

const {
  ACCOUNT_TYPE: BANK_ACCOUNT_TYPE,
  ACTIVITY: BANK_ACCOUNT_ACTIVITY
} = require('../../bank-account/constants');
const { DAYS_IN_YEAR } = require('../../bank-account/methods/common-operations/constants');


const createDepositWithDependencies = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.DepositProgram.fetchById(content.depositProgramId, { ...options, transaction })
    .then(depositProgram => {
      return generateContractNumber({ transaction })
      .then(contractNumber => {
        content = {
          ...content,
          contractNumber,
          dailyPercentChargeAmount: Number(content.amount) * depositProgram.percent / 100 / DAYS_IN_YEAR
        };

        return models.Deposit.createOne(content, { ...options, transaction })
        .tap(deposit => {
          content.depositId = deposit.id;
          return Promise.all([
            models.BankAccount.createBankAccount(
              { ...content, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.RAW },
              { ...options, transaction }
            ),
            models.BankAccount.createBankAccount(
              { ...content, activity: BANK_ACCOUNT_ACTIVITY.PASSIVE, accountType: BANK_ACCOUNT_TYPE.PERCENT },
              { ...options, transaction }
            ),
          ]);
        });
      })
    });
  });
};


const fetchDeposits = (where, options = {}) => {
  return models.Deposit.fetch(
    where,
    {
      include: [{
        model: models.BankAccount,
        as: 'bankAccounts',
        include: [
          {
            model: models.Transition,
            as: 'receivedTransitions',
            required: false
          },
          {
            model: models.Transition,
            as: 'sentTransitions',
            required: false
          }
        ]
      }],
      ...options
    },
  )
};


module.exports = {
  createDepositWithDependencies,
  fetchDeposits
};