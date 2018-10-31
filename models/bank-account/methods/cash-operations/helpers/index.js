const checkDepositState = ({ active }) => {
  if (!active) return Promise.reject('Deposit is no longer available.');
  return Promise.resolve();
};


module.exports = {
  checkDepositState
};