const models = require('../../models');
const { sequelize } = models;

const addStaticMethods = model => {
  model.createOne = (content, options = {}) => {
    if (!content) return Promise.reject(`Error creating ${model.name}, no data provided.`);

    options.returning = options.returning !== false;

    return sequelize.continueTransaction(options, () => {
      return model.create(content, options)
      .then(result => result || Promise.reject(`Error creating ${model.name}, no record successfully inserted.`))
      .catch(err => new Error(`Error creating one ${model.name}. \n ${err}`));
    });
  }
};

module.exports = {
  addStaticMethods
};