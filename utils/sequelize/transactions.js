const Promise = require('bluebird');

const addTransactionsBehaviour = sequelize => {
  sequelize.continueTransaction = (options = {}, callback) => {
    if (options.transaction || options.transaction === null) return Promise.resolve(callback(options.transaction));

    options.transactionPromise = sequelize.transaction(t => {
      options.transaction = t;
      return callback(t);
    });

    return options.transactionPromise;
  }
};

module.exports = {
  addTransactionsBehaviour
};