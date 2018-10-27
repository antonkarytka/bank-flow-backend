const models = require('../../../index');

function generateContractNumber ({ transaction } = {}) {
  const contractNumber = Math.floor(Math.random() * 10000000000000000).toString();

  return models.Deposit.fetchOne({ contractNumber }, { transaction })
  .then(deposit => {
    if (deposit) return generateContractNumber({ transaction });
    return contractNumber;
  })
}


module.exports = {
  generateContractNumber
};