const models = require('../../index');
const { sequelize } = models;
const { ACCOUNT_TYPE } = require('../constants');

const { generateBankAccountNumber } = require('./helpers');

const createBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.fetchById(
      content.userId,
      {
        attributes: ['firstName', 'lastName', 'patronymic'],
        transaction
      },
      { strict: true }
    )
    .then(({ firstName, lastName, patronymic }) => {
      const bankAccountContent = {
        ...content,
        number: generateBankAccountNumber(),
        name: `${firstName.toUpperCase()}_${lastName.toUpperCase()}_${patronymic.toUpperCase()}`
      };

      return models.BankAccount.createOne(bankAccountContent, { ...options, transaction });
    })
  });
};

const withdraw = ({ bankAccountId, amount }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchById(bankAccountId, { attributes: ['amount', 'accountType'], transaction }, { strict: true })
    .then(({ amount: currentAmount, accountType }) => {
      if (accountType !== ACCOUNT_TYPE.RAW) return Promise.reject(`Unable to withdraw money from bank account (${bankAccountId}): account type must be ${ACCOUNT_TYPE.RAW}.`);

      const updatedAmount = currentAmount - amount;
      if (updatedAmount < 0) return Promise.reject(`Unable to withdraw money from bank account (${bankAccountId}): insufficient funds. Current amount is ${currentAmount}.`);

      return models.BankAccount.updateOne({ id: bankAccountId }, { amount: updatedAmount }, { transaction })
    })
  })
};

const fetchBankAccountById = ({ bankAccountId }, options = {}) => {
  return models.BankAccount.fetchById(bankAccountId, {
    ...options,
    include: [{
      model: models.User,
      as: 'user',
      required: true
    }]
  })
};


const fetchCashboxAccount = (where, options = {}) => {
  return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX, ...where }, options);
};


module.exports = {
  createBankAccount,
  fetchBankAccountById,
  fetchCashboxAccount,
  withdraw
};