module.exports = {
  bankAccountCardId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'bankAccountCardId is required in params and must be a UUID.'
  }
};