const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../../constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE }, DAYS_IN_YEAR } = require('../common-operations/constants');
const { manipulateBankAccountAmount } = require('../common-operations');
const { checkDepositState } = require('./helpers');


const addMoneyToCashbox = ({ amount }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(
      INCREASE,
      { id: cashboxAccount.id, amount },
      { ...options, transaction }
    ))
  });
};


const transferToRawFromCashbox = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.RAW, depositId }, { ...options, transaction }),
      models.Deposit.fetchById(
        depositId,
        { ...options, include: [{ model: models.DepositProgram, as: 'depositProgram', required: true }], transaction
      })
    )
    .spread((cashboxAccount, rawAccount, deposit) => {
      return models.Deposit.updateOne(
        { id: depositId },
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
            { id: cashboxAccount.id, amount: cashboxAccount.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { id: rawAccount.id, amount: cashboxAccount.amount },
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


const transferToDevelopmentFundFromRaw = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(depositId, { ...options, transaction }, { strict: true })
    .then(deposit => {
      return checkDepositState(deposit)
      .then(() => {
        return Promise.join(
          models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
          models.BankAccount.fetchOne({ depositId, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
        )
        .spread((bankGrowthAccount, rawAccount) => {
          return Promise.all([
            manipulateBankAccountAmount(
              INCREASE,
              { id: bankGrowthAccount.id, amount: rawAccount.amount },
              { ...options, transaction }
            ),
            manipulateBankAccountAmount(
              DECREASE,
              { id: rawAccount.id, amount: rawAccount.amount },
              { ...options, transaction }
            )
          ])
          .then(() => ({
            senderBankAccountId: rawAccount.id,
            receiverBankAccountId: bankGrowthAccount.id,
            amount: rawAccount.amount
          }));
        });
      });
    });
  });
};


const transferToPercentageFromDevelopmentFund = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(depositId, { ...options, transaction })
    .then(deposit => {
      return checkDepositState(deposit)
      .then(() => {
        return Promise.join(
          models.BankAccount.fetchOne({ depositId: deposit.id, accountType: ACCOUNT_TYPE.PERCENTAGE }, { ...options, transaction }),
          models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction })
        )
        .spread((percentAccount, bankAccount) => {
          return Promise.all([
            manipulateBankAccountAmount(
              INCREASE,
              { id: percentAccount.id, amount: deposit.dailyPercentChargeAmount },
              { ...options, transaction }
            ),
            manipulateBankAccountAmount(
              DECREASE,
              { id: bankAccount.id, amount: deposit.dailyPercentChargeAmount },
              { ...options, transaction }
            )
          ])
          .then(() => ({
            senderBankAccountId: bankAccount.id,
            receiverBankAccountId: percentAccount.id,
            amount: deposit.dailyPercentChargeAmount
          }));
        });
      });
    });
  });
};


const transferAllToCashboxFromPercentage = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ depositId, accountType: ACCOUNT_TYPE.PERCENTAGE }, { ...options, transaction }),
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    )
    .spread((percentAccount, cashboxAccount) => {
      return Promise.all([
        manipulateBankAccountAmount(
          DECREASE,
          { id: percentAccount.id, amount: percentAccount.amount },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          INCREASE,
          { id: cashboxAccount.id, amount: percentAccount.amount },
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
};


const withdrawMoneyFromCashbox = (options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
    .then(cashboxAccount => manipulateBankAccountAmount(
      DECREASE,
      { id: cashboxAccount.id, amount: cashboxAccount.amount },
      { ...options, transaction }
    ));
  });
};

const transferAllToRawFromDevelopmentFund = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Deposit.fetchById(depositId, { ...options, transaction })
    .then(deposit => {
      return checkDepositState(deposit)
      .then(() => {
        return Promise.join(
          models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
          models.BankAccount.fetchOne({ depositId, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
        )
        .spread((bankGrowthAccount, rawAccount) => {
          return Promise.all([
            manipulateBankAccountAmount(
              DECREASE,
              { id: bankGrowthAccount.id, amount: deposit.amount },
              { ...options, transaction }
            ),
            manipulateBankAccountAmount(
              INCREASE,
              { id: rawAccount.id, amount: deposit.amount },
              { ...options, transaction }
            )
          ])
          .then(() => ({
            senderBankAccountId: bankGrowthAccount.id,
            receiverBankAccountId: rawAccount.id,
            amount: deposit.amount
          }))
        })
        .tap(() => models.Deposit.updateOne({ id: depositId }, { active: false }, { transaction }));
      });
    });
  });
};


const transferAllToCashboxFromRaw = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.BankAccount.fetchOne({ depositId, accountType: ACCOUNT_TYPE.RAW }, { ...options, transaction })
    )
    .spread((cashboxAccount, rawAccount) => {
      return Promise.all([
        manipulateBankAccountAmount(
          INCREASE,
          { id: cashboxAccount.id, amount: rawAccount.amount },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          DECREASE,
          { id: rawAccount.id, amount: rawAccount.amount },
          { ...options, transaction }
        )
      ])
      .then(() => ({
        senderBankAccountId: rawAccount.id,
        receiverBankAccountId: cashboxAccount.id,
        amount: rawAccount.amount
      }))
    })
  });
};


module.exports = {
  addMoneyToCashbox,
  transferToRawFromCashbox,
  transferToDevelopmentFundFromRaw,
  transferToPercentageFromDevelopmentFund,
  transferAllToCashboxFromPercentage,
  withdrawMoneyFromCashbox,
  transferAllToRawFromDevelopmentFund,
  transferAllToCashboxFromRaw
};