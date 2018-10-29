const models = require('../../../../index');

const validateOperationPossibility = ({ depositId, allowedLatestOperations = [], errorMessage }, { transaction } = {}) => {
  return models.Deposit.fetchById(depositId, { transaction }, { strict: true })
  .then(deposit => {
    if (!allowedLatestOperations.includes(deposit.latestOperation)) {
      return Promise.reject(`${errorMessage} Current latest operation: ${deposit.latestOperation}.`);
    }

    return deposit;
  })
};


module.exports = {
  validateOperationPossibility
};