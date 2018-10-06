module.exports = {
  depositTypeId: {
    in: ['body'],
    isUUID: true,
    errorMessage: '\'depositTypeId\' is required.'
  },
  userId: {
    in: ['body'],
    isUUID: true,
    errorMessage: '\'userId\' is required.'
  },
  depositProgramCreatedAt: {
    in: ['body'],
    isISO8601: true,
    errorMessage: 'The \'depositProgramCreatedAt\' field must follow the standard ISO 8601 (YYYY-MM-DDThh:mm:ss)'
  },
  depositProgramEndsAt: {
    in: ['body'],
    isISO8601: true,
    errorMessage: 'The \'depositProgramEndsAt\' field must follow the standard ISO 8601 (YYYY-MM-DDThh:mm:ss)'
  },
  amount: {
    in: ['body'],
    isFloat: true,
    errorMessage: '\'amount\' field is required.'
  },
  contractNumber: {
    in: ['body'],
    isString: true,
    errorMessage: 'The \'contractNumber\' field is required'
  }
};