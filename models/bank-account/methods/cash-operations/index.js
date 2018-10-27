const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../../constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE }, DAYS_IN_YEAR } = require('../common-operations/constants');
const { manipulateBankAccountAmount } = require('../common-operations');


const putMoneyOnCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(
      INCREASE,
      { ...content, id: cashboxAccount.id },
      { ...options, transaction }
    ));
  });
};


const transferMoneyToRawAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.RAW, depositId: content.id }, { ...options, transaction }),
      models.Deposit.fetchById(content.id, { ...options, include: [{model: models.DepositProgram, as: 'depositProgram'}], transaction })
    )
    .spread((cashboxAccount, rawAccount, deposit) => {
      return models.Deposit.updateOne({ id: content.id },
        { amount: deposit.amount + cashboxAccount.amount,
          dailyPercentChargeAmount: (deposit.amount + cashboxAccount.amount) * deposit.depositProgram.percent / 100 / DAYS_IN_YEAR
        }, { ...options, transaction})
      .tap(deposit => {
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
  });
};


const useMoneyInsideBank = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction }),
      models.BankAccount.fetchOne({ depositId: content.id, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
    )
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
    });
  });
};


const addInterestCharge = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
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
    });
  });
};


const getAllPercentCharges = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
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
    });
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
    return models.Deposit.fetchById(content.id, { ...options, transaction })
    .then(deposit => {
      return Promise.join(
        models.BankAccount.fetchOne({accountType: ACCOUNT_TYPE.BANK_GROWTH}, { ...options, transaction }),
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
    });
  });
};


const getAllRawAmount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
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
    });
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