module.exports = {
  userId: {
    in: ['params'],
    isUUID: true,
    errorMessage: 'User\'s \'id\' property is required.'
  }
};