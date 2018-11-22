const models = require('../../../models');
const { ACTIVITY, ACCOUNT_TYPE } = require('../../../models/bank-account/constants');
const { data: users } = require('../users');

const bankAccounts = {};

bankAccounts['266529598564'] = {
  id: 'fb2379af-781c-4fd6-b105-8f40997c9aeb',
  number: '266529598564',
  numberCode: 3012,
  name: 'Andrew Calyatka',
  amount: 4000.23,
  activity: ACTIVITY.ACTIVE,
  accountType: ACCOUNT_TYPE.DEVELOPMENT_FUND,
  userId: users['andrew_calyatka'].id
};

bankAccounts['266529598565'] = {
  id: '35fbbf80-10b5-4743-bae3-5a7cd3a0312f',
  number: '266529598565',
  numberCode: 3012,
  amount: 1239.99,
  name: 'Uladzislau Kirichenka',
  activity: ACTIVITY.ACTIVE,
  accountType: ACCOUNT_TYPE.CASHBOX,
  userId: users['uladzislau_kirichenka'].id
};


module.exports = {
  data: bankAccounts,
  model: models.BankAccount
};