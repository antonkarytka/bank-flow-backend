module.exports = {
  depositProgramId: {
    in: ['body'],
    isUUID: true,
    errorMessage: '\'depositProgramId\' is required.'
  },
  userId: {
    in: ['body'],
    isUUID: true,
    errorMessage: '\'userId\' is required.'
  },
  amount: {
    in: ['body'],
    isFloat: true,
    errorMessage: '\'amount\' field is required.'
  }
};