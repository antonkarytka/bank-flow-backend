module.exports = {
  pin: {
    in: ['body'],
    isString: true,
    errorMessage: 'pin is required in body and must be a string.'
  },
  bankAccountId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'bankAccountId is required in body and must be a UUID.'
  }
};