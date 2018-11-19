module.exports = {
  number: {
    in: ['body'],
    isString: true,
    errorMessage: 'number is required in body and must be a string.'
  },
  pin: {
    in: ['body'],
    isString: true,
    errorMessage: 'pin is required in body and must be a string.'
  }
};