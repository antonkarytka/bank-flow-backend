const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../../../../helpers/common-constants/constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE }, DAYS_IN_YEAR } = require('../../../../helpers/common-constants/constants');
const { manipulateBankAccountAmount } = require('../common-operations');
const { checkDepositState } = require('./helpers');


/**
 * Add amount of money to bank's cashbox.
 *
 * @param amount
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer money from bank's cashbox to client's raw bank account.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer money to development fund from client's raw bank account to use money inside bank.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer percentage money to cashbox from development fund.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer percentage money to cashbox from client's percentage bank account.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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


/**
 * Withdraw all money from cashbox.
 *
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer all money to client's raw bank account from development fund, i.e. deactivate deposit.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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


/**
 * Transfer all deposit's money to cashbox.
 *
 * @param depositId
 * @param options
 * @returns {*}
 */
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