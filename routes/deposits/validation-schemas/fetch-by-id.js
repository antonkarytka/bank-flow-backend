module.exports = {
  depositId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'depositId is required and must be a UUID.'
  }
};