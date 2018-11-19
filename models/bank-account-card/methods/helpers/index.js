const models = require('../../../index');

const generateCardNumber = ({ transaction } = {}) => {
  const cardNumber = Math.floor(Math.random() * 10000000000000000).toString();

  return models.BankAccountCard.fetchOne({ number: cardNumber }, { transaction })
  .then(entry => {
    if (entry) return generateCardNumber({ transaction });
    return cardNumber;
  })
};


module.exports = {
  generateCardNumber
};