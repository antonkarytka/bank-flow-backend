const MODEL_NAME = 'Deposit';
const TABLE_NAME = 'deposits';

const OPERATION = {
  TRANSFER_MONEY_TO_RAW_ACCOUNT: 'transferMoneyToRawAccount',
  USE_MONEY_INSIDE_BANK: 'useMoneyInsideBank',
  ADD_INTEREST_CHARGE: 'addInterestCharge',
  GET_ALL_PERCENT_CHARGES: 'getAllPercentCharges',
  SET_FINISH_DEPOSIT_STATE: 'setFinishDepositState',
  GET_ALL_RAW_AMOUNT: 'getAllRawAmount'
};

module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  OPERATION
};