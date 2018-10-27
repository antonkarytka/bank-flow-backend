module.exports = {
  id: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'Deposit Id should be an UUID.'
  }
};