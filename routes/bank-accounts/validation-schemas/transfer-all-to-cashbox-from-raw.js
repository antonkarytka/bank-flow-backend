module.exports = {
  depositId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'Deposit Id should be an UUID.'
  }
};