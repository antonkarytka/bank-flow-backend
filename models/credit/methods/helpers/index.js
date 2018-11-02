const models = require('../../../index');

function generateContractNumber ({ transaction } = {}) {
  const contractNumber = Math.floor(Math.random() * 10000000000000000).toString();

  return models.Credit.fetchOne({ contractNumber }, { transaction })
  .then(credit => {
    if (credit) return generateContractNumber({ transaction });
    return contractNumber;
  })
}


module.exports = {
  generateContractNumber
};