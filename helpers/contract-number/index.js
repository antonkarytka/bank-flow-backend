function generateContractNumber (model, { transaction } = {}) {
  if (!model) return Promise.reject('Model must be provided as the first parameter to generate a contract number for it');

  const contractNumber = Math.floor(Math.random() * 10000000000000000).toString();

  return model.fetchOne({ contractNumber }, { transaction })
  .then(entry => {
    if (entry) return generateContractNumber({ transaction });
    return contractNumber;
  })
}


module.exports = generateContractNumber;