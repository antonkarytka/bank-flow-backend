module.exports = {
  bankAccountId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'bankAccountId is required in params and must be a UUID.'
  },
  amount: {
    in: ['body'],
    isNumeric: true,
    errorMessage: 'amount is required in body and must be a numeric.'
  }
};