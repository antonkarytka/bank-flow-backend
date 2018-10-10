const models = require('../../index');
const { sequelize } = models;

const createBankAccount = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    const bankAccountContent = {
      ...content,
      number: Math.floor(Math.random() * (1000 - 1)) + 1, //TODO: Replace with real number
      numberCode: Math.floor(Math.random() * (1000 - 1)) + 1, //TODO: Replace with real number
      debit: 0,
      credit: 0,
      remainder: 0,
      name: 'tempName', //TODO: Replace with real name
    };

    return models.BankAccount.createOne(bankAccountContent, { ...options, transaction});
  });
};

module.exports = {
  createBankAccount
};