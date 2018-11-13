const models = require('../../index');
const { sequelize } = models;

const { generateCardNumber } = require('./helpers');

const createBankAccountCard = ({ pin }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return generateCardNumber({ transaction })
    .then(cardNumber => models.BankAccountCard.createOne({ number: cardNumber, pin }, { transaction }))
  });
};


module.exports = {
  createBankAccountCard
};