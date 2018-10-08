const MODEL_NAME = 'DepositProgram';
const TABLE_NAME = 'deposit_programs';


const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  BYN: 'BYN',
  RUB: 'RUB',
};

const TYPE = {
  URGENT_REVOCABLE: 'urgent_revocable',
  URGENT_IRREVOCABLE: 'urgent_irrevocable',
};

module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  CURRENCY,
  TYPE
};