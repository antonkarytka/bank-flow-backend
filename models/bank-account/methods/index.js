const models = require('../../index');
const { sequelize } = models;
const { ACCOUNT_TYPE, AMOUNT_ACTION: { INCREASE, DECREASE } } = require('../constants');

const { manipulateBankAccountAmount } = require('./common-operations');
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

const topUp = ({ bankAccountId, amount }, options = {}) => {
  if (amount <= 0) return Promise.reject(`Amount must be a positive numeric.`);
  return manipulateBankAccountAmount(INCREASE, { id: bankAccountId, amount }, { clean: true, ...options });
};

const withdraw = ({ bankAccountId, amount }, options = {}) => {
  if (amount <= 0) return Promise.reject(`Amount must be a positive numeric.`);
  return manipulateBankAccountAmount(DECREASE, { id: bankAccountId, amount }, { clean: true, ...options });
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
  topUp,
  withdraw
};