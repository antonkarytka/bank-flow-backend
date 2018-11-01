module.exports = {
  amount: {
    in: ['body'],
    isFloat: true,
    errorMessage: 'amount is required in body and must be a float number.'
  }
};