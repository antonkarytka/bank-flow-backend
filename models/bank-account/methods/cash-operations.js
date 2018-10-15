const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../constants');
const { manipulateBankAccountAmount } = require('./common-operations');
const { AMOUNT_ACTION } = require('./common-operations/constants');

const putMoneyOnCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE,
        { ...content, id: cashboxAccount.id },
        { ...options, transaction });
    });
  });
};

const transferMoneyToRawAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.RAW, depositId: content.id },
        { ...options, transaction })
      .tap(rawAccount => {
        return Promise.all([
          manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE,
            {...content, amount: cashboxAccount.amount, id: cashboxAccount.id},
            {...options, transaction}),
          manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE,
            {...content, amount: cashboxAccount.amount, id: rawAccount.id},
            {...options, transaction})
        ])
      })
    });
  });
};

const useMoneyInsideBank = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction })
      .then(bankGrowthAccount => {
        return models.BankAccount.fetchOne({ depositId: content.id, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
        .tap(rawAccount => {
          return Promise.all([
            manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE,
              { ...content, amount: rawAccount.amount, id: bankGrowthAccount.id },
              { ...options, transaction }),
            manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE,
              { ...content, amount: rawAccount.amount, id: rawAccount.id },
              { ...options, transaction })
          ]);
        });
      });
  });
};

const addInterestCharge = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
    .tap(deposit => {
      return Promise.all([
        models.BankAccount.fetchOne({ depositId: deposit.id, accountType: ACCOUNT_TYPE.PERCENT }, { ...options, transaction })
        .then(percentAccount => {
          return manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE, {
            ...content, amount: deposit.dailyPercentChargeAmount, id: percentAccount.id
          }, { ...options, transaction })
        }),
        models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.BANK_GROWTH }, { ...options, transaction })
        .then(bankAccount=> {
          return manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE, {
            ...content, amount: deposit.dailyPercentChargeAmount, id: bankAccount.id
          }, { ...options, transaction })
        })
      ]);
    });
  });
};

const getAllPercentCharges = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
    .tap(deposit => {
      return models.BankAccount.fetchOne({ depositId: deposit.id, accountType: ACCOUNT_TYPE.PERCENT }, { ...options, transaction })
      .then(percentAccount => {
        return Promise.all([
          manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE, {
            ...content, amount: percentAccount.amount, id: percentAccount.id
          }, { ...options, transaction }),
          models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
          .then(cashboxAccount => {
            return manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE, {
              ...content, amount: percentAccount.amount, id: cashboxAccount.id
            }, { ...options, transaction })
          })
        ])
      })
    });
  });
};

const getMoneyFromCashbox = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => {
      return manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE,
        { ...content, amount: cashboxAccount.amount, id: cashboxAccount.id },
        { ...options, transaction });
    });
  });
};

const setFinishDepositState = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
    .tap(deposit => {
      return Promise.all([
        models.BankAccount.fetchOne({accountType: ACCOUNT_TYPE.BANK_GROWTH}, { ...options, transaction })
        .then(bankGrowthAccount => {
          return manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE,
            { ...content, amount: deposit.amount, id: bankGrowthAccount.id },
            { ...options, transaction });
        }),
        models.BankAccount.fetchOne({ depositId: deposit.id , accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
        .then(rawAccount => {
          return manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE,
            { ...content, amount: deposit.amount, id: rawAccount.id },
            { ...options, transaction });
        })
      ]);
    });
  });
};

const getAllRawAmount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(content.id, { ...options, transaction })
    .tap(deposit => {
      return Promise.all([
        models.BankAccount.fetchOne({accountType: ACCOUNT_TYPE.CASHBOX}, { ...options, transaction })
          .then(cashboxAccount => {
            return manipulateBankAccountAmount(AMOUNT_ACTION.INCREASE,
              { ...content, amount: deposit.amount, id: cashboxAccount.id },
              { ...options, transaction });
          }),
        models.BankAccount.fetchOne({ depositId: deposit.id , accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
          .then(rawAccount => {
            return manipulateBankAccountAmount(AMOUNT_ACTION.DECREASE,
              { ...content, amount: deposit.amount, id: rawAccount.id },
              { ...options, transaction });
          })
      ]);
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