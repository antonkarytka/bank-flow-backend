const recalculateBankAccountAmounts = require('./recalculate-bank-account-amounts');

const scheduleJobs = () => {
  recalculateBankAccountAmounts();
};

module.exports = scheduleJobs;