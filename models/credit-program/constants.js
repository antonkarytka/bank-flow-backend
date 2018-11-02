const MODEL_NAME = 'DepositProgram';
const TABLE_NAME = 'deposit_programs';


const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  BYN: 'BYN',
  RUB: 'RUB',
};

const TYPE = {
  ANNUITY_PAYMENTS: 'annuity', // paying equal sums throughout credit's period
  MONTHLY_PERCENTAGE_PAYMENT: 'monthly_percentage_payment' // paying credit's percentage every month and paying the whole sum in the end of credit's period
};

module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  CURRENCY,
  TYPE
};