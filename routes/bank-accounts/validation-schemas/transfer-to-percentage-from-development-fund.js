module.exports = {
  depositId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'depositId is required in body and must be a UUID.'
  }
};