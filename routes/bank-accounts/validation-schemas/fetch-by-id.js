module.exports = {
  bankAccountId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'bankAccountId must be passed in params and must be a UUID.'
  }
};