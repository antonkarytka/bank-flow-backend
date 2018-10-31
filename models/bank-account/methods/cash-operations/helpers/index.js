const checkDepositState = ({ active }) => !active && Promise.reject('Deposit is no longer available.');


module.exports = {
  checkDepositState
};