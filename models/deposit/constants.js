const MODEL_NAME = 'Deposit';
const TABLE_NAME = 'deposits';

const STATUS = {
  INITIAL: 'initial',
  MONEY_PUT_ON_CASHBOX: 'moneyPutOnCashbox',
  MONEY_TRANSFERRED_TO_RAW_ACCOUNT: 'moneyTransferredToRawAccount',
  MONEY_USED_INSIDE_BANK: 'moneyUserInsideBank',
  INTEREST_CHARGE_ADDED: 'interestChargeAdded',
  GOT_ALL_PERCENT_CHARGES: 'gotAllPercentCharges',
  GOT_MONEY_FROM_CASHBOX: 'gotMoneyFromCashbox',
  SET_FINISH_DEPOSIT_STATE: 'setFinishDepositState',
  GOT_ALL_RAW_AMOUNT: 'gotAllRawAmount'
};

module.exports = {
  MODEL_NAME,
  TABLE_NAME,

  STATUS
};