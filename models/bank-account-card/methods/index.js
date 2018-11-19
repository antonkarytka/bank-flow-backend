const bcrypt = require('bcrypt');

const models = require('../../index');
const { sequelize } = models;

const { generateCardNumber } = require('./helpers');

const createBankAccountCard = ({ pin, bankAccountId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return generateCardNumber({ transaction })
    .then(cardNumber => models.BankAccountCard.createOne({ number: cardNumber, pin, bankAccountId }, { transaction }))
  });
};

const logIn = ({ number, pin }) => {
  return models.BankAccountCard.fetchOne({ number }, {}, { strict: true })
  .then(bankAccountCard => {
    const pinsMatch = bcrypt.compareSync(pin, bankAccountCard.pin);

    if (pinsMatch) return bankAccountCard;
    else return Promise.reject('Provided password does not match the real one.');
  });
};


module.exports = {
  createBankAccountCard,
  logIn
};