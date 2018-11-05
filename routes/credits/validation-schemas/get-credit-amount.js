module.exports = {
  creditId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'creditId is required and must be a UUID.'
  }
};