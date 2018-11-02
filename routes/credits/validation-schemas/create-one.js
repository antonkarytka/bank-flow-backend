module.exports = {
  creditProgramId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'creditProgramId is required and must be a UUID.'
  },
  userId: {
    in: ['body'],
    isUUID: true,
    errorMessage: 'userId is required and must be a UUID.'
  },
  amount: {
    in: ['body'],
    isFloat: true,
    errorMessage: 'amount field is required and must be a float.'
  }
};