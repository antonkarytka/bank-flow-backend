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

const BANK_CODE = 266;
const BALANCE_ACCOUNT_NUMBER = 312;
const BELARUSIAN_NATIONAL_BANK_WEIGHT_COEFFICIENTS = ['713', '371', '371', '371', '371', '3'];


module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  ACTIVITY,
  ACCOUNT_TYPE,

  BANK_CODE,
  BALANCE_ACCOUNT_NUMBER,
  BELARUSIAN_NATIONAL_BANK_WEIGHT_COEFFICIENTS
};