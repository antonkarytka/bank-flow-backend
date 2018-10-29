const models = require('../../../../index');

const validateDepositStatus = ({ depositId, allowedStatuses = [], errorMessage }, { transaction } = {}) => {
  return models.Deposit.fetchById(depositId, { attributes: ['status'], transaction }, { strict: true })
  .then(({ status }) => {
    if (!allowedStatuses.includes(status)) {
      return Promise.reject(errorMessage)
    }
  })
};


module.exports = {
  validateDepositStatus
};