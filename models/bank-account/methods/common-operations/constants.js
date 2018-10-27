const AMOUNT_ACTION = {
  INCREASE: 'increase',
  DECREASE: 'decrease'
};

const ALLOWED_AMOUNT_ACTIONS = Object.values(AMOUNT_ACTION);

const DAYS_IN_YEAR = 365;

module.exports = {
  AMOUNT_ACTION,
  ALLOWED_AMOUNT_ACTIONS,
  DAYS_IN_YEAR
};