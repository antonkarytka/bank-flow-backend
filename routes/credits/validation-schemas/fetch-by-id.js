module.exports = {
  creditId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'creditId is required and must be a UUID.'
  }
};