const models = require('../../../models');
const { data: bankAccounts } = require('../bank-accounts');

const bankAccountCards = {};

bankAccountCards['4343434343434343'] = {
  id: '0000ffff-0d99-4e11-9b50-0000ffff0000',
  number: '4343434343434343',
  pin: '5555',
  bankAccountId: bankAccounts['266529598564'].id
};

bankAccountCards['5656565656565656'] = {
  id: '77304589-0c5f-4331-a837-5fab45b55455',
  number: '5656565656565656',
  pin: '5555',
  bankAccountId: bankAccounts['266529598565'].id
};


module.exports = {
  data: bankAccountCards,
  model: models.BankAccountCard
};