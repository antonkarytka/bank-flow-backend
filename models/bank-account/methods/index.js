const models = require('../../index');
const { sequelize } = models;

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

module.exports = {
  createBankAccount
};