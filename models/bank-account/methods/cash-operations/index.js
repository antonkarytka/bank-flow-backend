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
      models.Deposit.fetchById(depositId, {
        ...options,
        include: [
          {
            model: models.DepositProgram,
            as: 'depositProgram',
            attributes: ['percent'],
            required: true
          }
        ],
        transaction
      })
    )
    .spread((cashboxBankAccount, deposit) => {
      return models.Deposit.updateOne(
        { id: depositId },
        {
          amount: deposit.amount + cashboxBankAccount.amount,
          dailyPercentChargeAmount: (deposit.amount + cashboxBankAccount.amount) * deposit.depositProgram.percent / 100 / DAYS_IN_YEAR
        },
        { ...options, transaction }
      )
      .then(() => {
        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { id: cashboxBankAccount.id, amount: cashboxBankAccount.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { id: deposit.rawBankAccountId, amount: cashboxBankAccount.amount },
            { ...options, transaction }
          )
        ])
      })
      .then(() => ({
        senderBankAccountId: cashboxBankAccount.id,
        receiverBankAccountId: deposit.rawBankAccountId,
        amount: cashboxBankAccount.amount
      }))
    })
  });
};


const transferToDevelopmentFundFromRaw = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
      models.Deposit.fetchById(depositId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'rawBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((developmentFundBankAccount, deposit) => {
      return checkDepositState(deposit)
      .then(() => {
        const { rawBankAccount } = deposit;

        return Promise.all([
          manipulateBankAccountAmount(
            INCREASE,
            { id: developmentFundBankAccount.id, amount: rawBankAccount.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            DECREASE,
            { id: rawBankAccount.id, amount: rawBankAccount.amount },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: rawBankAccount.id,
          receiverBankAccountId: developmentFundBankAccount.id,
          amount: rawBankAccount.amount
        }));
      });
    });
  });
};


const transferToPercentageFromDevelopmentFund = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
      models.Deposit.fetchById(depositId, { ...options, transaction })
    )
    .spread((developmentFundBankAccount, deposit) => {
      return checkDepositState(deposit)
      .then(() => {
        return Promise.all([
          manipulateBankAccountAmount(
            INCREASE,
            { id: deposit.percentageBankAccountId, amount: deposit.dailyPercentChargeAmount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            DECREASE,
            { id: developmentFundBankAccount.id, amount: deposit.dailyPercentChargeAmount },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: developmentFundBankAccount.id,
          receiverBankAccountId: deposit.percentageBankAccountId,
          amount: deposit.dailyPercentChargeAmount
        }));
      });
    });
  });
};


const transferAllToCashboxFromPercentage = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.Deposit.fetchById(depositId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'percentageBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((cashboxBankAccount, deposit) => {
      return checkDepositState(deposit)
      .then(() => {
        const { percentageBankAccount } = deposit;

        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { id: percentageBankAccount.id, amount: percentageBankAccount.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { id: cashboxBankAccount.id, amount: percentageBankAccount.amount },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: percentageBankAccount.id,
          receiverBankAccountId: cashboxBankAccount.id,
          amount: percentageBankAccount.amount
        }))
      })
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
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND }, { ...options, transaction }),
      models.Deposit.fetchById(depositId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'rawBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((developmentFundBankAccount, deposit) => {
      return checkDepositState(deposit)
      .then(() => {
        const { rawBankAccount } = deposit;

        return Promise.all([
          manipulateBankAccountAmount(
            DECREASE,
            { id: developmentFundBankAccount.id, amount: deposit.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            INCREASE,
            { id: rawBankAccount.id, amount: deposit.amount },
            { ...options, transaction }
          )
        ])
        .tap(() => models.Deposit.updateOne({ id: depositId }, { active: false }, { transaction }))
        .then(() => ({
          senderBankAccountId: developmentFundBankAccount.id,
          receiverBankAccountId: rawBankAccount.id,
          amount: deposit.amount
        }))
      })
    });
  });
};


const transferAllToCashboxFromRaw = ({ depositId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.Deposit.fetchById(depositId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'rawBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((cashboxBankAccount, deposit) => {
      return checkDepositState(deposit)
      .then(() => {
        const { rawBankAccount } = deposit;

        return Promise.all([
          manipulateBankAccountAmount(
            INCREASE,
            { id: cashboxBankAccount.id, amount: rawBankAccount.amount },
            { ...options, transaction }
          ),
          manipulateBankAccountAmount(
            DECREASE,
            { id: rawBankAccount.id, amount: rawBankAccount.amount },
            { ...options, transaction }
          )
        ])
        .then(() => ({
          senderBankAccountId: rawBankAccount.id,
          receiverBankAccountId: cashboxBankAccount.id,
          amount: rawBankAccount.amount
        }))
      })
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