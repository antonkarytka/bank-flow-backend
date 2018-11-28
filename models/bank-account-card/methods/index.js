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
  return models.BankAccountCard.fetchOne(
    { number },
    {
      include: [{
        model: models.BankAccount,
        as: 'bankAccount',
        required: true,
        include: [{
          model: models.User,
          as: 'user',
          required: true
        }]
      }]
    },
    { strict: true }
  )
  .then(bankAccountCard => {
    if (!bankAccountCard.active) return Promise.reject('cardDeactivated');

    const pinsMatch = bcrypt.compareSync(pin, bankAccountCard.pin);
    if (pinsMatch) return bankAccountCard;
    else return Promise.reject('Provided password does not match the real one.');
  });
};

const setActive = ({ bankAccountCardId, active = true }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccountCard.updateOne({ id: bankAccountCardId }, { active }, { ...options, transaction })
  });
};

const deactivateByNumber = ({ number }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccountCard.updateOne({ number }, { active: false }, { ...options, transaction })
  });
};


module.exports = {
  createBankAccountCard,
  logIn,
  setActive,
  deactivateByNumber
};