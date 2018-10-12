const MODEL_NAME = 'BankAccount';
const TABLE_NAME = 'bank_accounts';

const ACTIVITY = {
  ACTIVE: 'active',
  ACTIVE_PASSIVE: 'active_passive',
  PASSIVE: 'passive'
};

const ACCOUNT_TYPE = {
  RAW: 'raw',
  PERCENT: 'percent',
  BANK_GROWTH: 'bank_growth',
  CASHBOX: 'cashbox'
};

module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  ACTIVITY,
  ACCOUNT_TYPE
};