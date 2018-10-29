const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;
const { OPERATION } = require('../../../deposit/constants');

const { ACCOUNT_TYPE } = require('../../constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE }, DAYS_IN_YEAR } = require('../common-operations/constants');
const { manipulateBankAccountAmount } = require('../common-operations');
const { validateOperationPossibility } = require('./helpers');


const putMoneyOnCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(
      INCREASE,
      { ...content, id: cashboxAccount.id },
      { ...options, transaction }
    ))
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.PUT_MONEY_ON_CASHBOX }, { transaction }))
  });
};


const transferMoneyToRawAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.PUT_MONEY_ON_CASHBOX],
        errorMessage: `Unable to transfer money to raw account. Latest deposit's operation must be: ${OPERATION.PUT_MONEY_ON_CASHBOX}.`
      },
      { transaction }
    )
    .then(() => Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.RAW, depositId: content.id }, { ...options, transaction }),
      models.Deposit.fetchById(content.id, { ...options, include: [{model: models.DepositProgram, as: 'depositProgram'}], transaction })
    ))
    .spread((cashboxAccount, rawAccount, deposit) => {
      return models.Deposit.updateOne(
        { id: content.id },
        {
          amount: deposit.amount + cashboxAccount.amount,
          dailyPercentChargeAmount: (deposit.amount + cashboxAccount.amount) * deposit.depositProgram.percent / 100 / DAYS_IN_YEAR
        },
        { ...options, transaction }
      )
      .then(() => {
        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { ...content, amount: cashboxAccount.amount, id: cashboxAccount.id },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { ...content, amount: cashboxAccount.amount, id: rawAccount.id },
            { ...options, transaction }
          )
        ])
      })
      .then(() => ({
        senderBankAccountId: cashboxAccount.id,
        receiverBankAccountId: rawAccount.id,
        amount: cashboxAccount.amount
      }))
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.TRANSFER_MONEY_TO_RAW_ACCOUNT }, { transaction }))
  });
};


const useMoneyInsideBank = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.TRANSFER_MONEY_TO_RAW_ACCOUNT],
        errorMessage: `Unable to use money inside bank. Latest deposit's operation must be: ${OPERATION.TRANSFER_MONEY_TO_RAW_ACCOUNT}.`
      },
      { transaction }
    )
    .then(() => Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction }),
      models.BankAccount.fetchOne({ depositId: content.id, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
    ))
    .spread((bankGrowthAccount, rawAccount) => {
      return Promise.all([
        manipulateBankAccountAmount(
          INCREASE,
          { ...content, amount: rawAccount.amount, id: bankGrowthAccount.id },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          DECREASE,
          { ...content, amount: rawAccount.amount, id: rawAccount.id },
          { ...options, transaction }
        )
      ])
      .then(() => ({
        senderBankAccountId: rawAccount.id,
        receiverBankAccountId: bankGrowthAccount.id,
        amount: rawAccount.amount
      }))
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.USE_MONEY_INSIDE_BANK }, { transaction }))
  });
};


const addInterestCharge = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.USE_MONEY_INSIDE_BANK],
        errorMessage: `Unable to add interest charge. Latest deposit's operation must be: ${OPERATION.USE_MONEY_INSIDE_BANK}.`
      },
      { transaction }
    )
    .then(deposit => {
      return Promise.join(
        models.BankAccount.fetchOne({ depositId: deposit.id, accountType: ACCOUNT_TYPE.PERCENT }, { ...options, transaction }),
        models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction })
      )
      .spread((percentAccount, bankAccount) => {
        return Promise.all([
          manipulateBankAccountAmount(
            INCREASE,
            { ...content, amount: deposit.dailyPercentChargeAmount, id: percentAccount.id },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            DECREASE,
            { ...content, amount: deposit.dailyPercentChargeAmount, id: bankAccount.id },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: bankAccount.id,
          receiverBankAccountId: percentAccount.id,
          amount: deposit.dailyPercentChargeAmount
        }))
      })
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.ADD_INTEREST_CHARGE }, { transaction }))
  });
};


const getAllPercentCharges = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.ADD_INTEREST_CHARGE],
        errorMessage: `Unable to get all percent charges. Latest deposit's operation must be: ${OPERATION.ADD_INTEREST_CHARGE}.`
      },
      { transaction }
    )
    .then(deposit => {
      return Promise.join(
        models.BankAccount.fetchOne({ depositId: deposit.id, accountType: ACCOUNT_TYPE.PERCENT }, { ...options, transaction }),
        models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
      )
      .spread((percentAccount, cashboxAccount) => {
        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { ...content, amount: percentAccount.amount, id: percentAccount.id },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { ...content, amount: percentAccount.amount, id: cashboxAccount.id },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: percentAccount.id,
          receiverBankAccountId: cashboxAccount.id,
          amount: percentAccount.amount
        }))
      })
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.GET_ALL_PERCENT_CHARGES }, { transaction }))
  });
};


const getMoneyFromCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(
      DECREASE,
      { ...content, amount: cashboxAccount.amount, id: cashboxAccount.id },
      { ...options, transaction }
    ));
  });
};

const setFinishDepositState = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.GET_MONEY_FROM_CASHBOX],
        errorMessage: `Unable to set finish deposit state. Latest deposit's operation must be: ${OPERATION.GET_MONEY_FROM_CASHBOX}.`
      },
      { transaction }
    )
    .then(deposit => {
      return Promise.join(
        models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction }),
        models.BankAccount.fetchOne({ depositId: deposit.id , accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
      )
      .spread((bankGrowthAccount, rawAccount) => {
        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { ...content, amount: deposit.amount, id: bankGrowthAccount.id },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { ...content, amount: deposit.amount, id: rawAccount.id },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: bankGrowthAccount.id,
          receiverBankAccountId: rawAccount.id,
          amount: deposit.amount
        }))
      })
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.SET_FINISH_DEPOSIT_STATE }, { transaction }))
  });
};


const getAllRawAmount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return validateOperationPossibility(
      {
        depositId: content.id,
        allowedLatestOperations: [OPERATION.SET_FINISH_DEPOSIT_STATE],
        errorMessage: `Unable to get all raw amount. Latest deposit's operation must be: ${OPERATION.SET_FINISH_DEPOSIT_STATE}.`
      },
      { transaction }
    )
    .then(deposit => {
      return Promise.join(
        models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
        models.BankAccount.fetchOne({ depositId: deposit.id , accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
      )
      .spread((cashboxAccount, rawAccount) => {
        return Promise.all([
          manipulateBankAccountAmount(
            INCREASE,
            { ...content, amount: deposit.amount, id: cashboxAccount.id },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            DECREASE,
            { ...content, amount: deposit.amount, id: rawAccount.id },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: rawAccount.id,
          receiverBankAccountId: cashboxAccount.id,
          amount: deposit.amount
        }))
      })
    })
    .tap(() => models.Deposit.updateOne(content.id, { latestOperation: OPERATION.GET_ALL_RAW_AMOUNT }, { transaction }))
  });
};


module.exports = {
  putMoneyOnCashbox,
  transferMoneyToRawAccount,
  useMoneyInsideBank,
  addInterestCharge,
  getAllPercentCharges,
  getMoneyFromCashbox,
  setFinishDepositState,
  getAllRawAmount
};