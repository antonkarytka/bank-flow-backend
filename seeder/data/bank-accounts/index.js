const models = require('../../../models');
const { ACTIVITY, ACCOUNT_TYPE } = require('../../../models/bank-account/constants');

const bankAccounts = {};

bankAccounts['266529598564'] = {
  id: 'fb2379af-781c-4fd6-b105-8f40997c9aeb',
  number: '266529598564',
  numberCode: 3012,
  name: 'Andrew Calyatka',
  activity: ACTIVITY.ACTIVE,
  accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND
};

bankAccounts['266529598565'] = {
  id: '35fbbf80-10b5-4743-bae3-5a7cd3a0312f',
  number: '266529598565',
  numberCode: 3012,
  name: 'Uladzislau Kirichenka',
  activity: ACTIVITY.ACTIVE,
  accountType: ACCOUNT_TYPE.CASHBOX
};


module.exports = {
  data: bankAccounts,
  model: models.BankAccount
};