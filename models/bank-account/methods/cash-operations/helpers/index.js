const checkDepositState = (deposit) => {
  return deposit.isFinished
    ? Promise.reject('Sorry, but this deposit has been finished')
    : Promise.resolve(deposit);
};


module.exports = {
  checkDepositState
};