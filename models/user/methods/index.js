const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchUsers = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.fetch(where, {
      include: [
        { model: models.City, as: 'city'},
        { model: models.Citizenship, as: 'citizenship'},
        { model: models.Disability, as: 'disability'},
      ],
      transaction
    });
  });
};

const createUserWithDependencies = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.createOne(content, { ...options, transaction })
  });
};

const updateUser = (where, content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.updateOne(where, content, { ...options, transaction })
  });
};

const deleteUser = (where, options = {}) => {
  options.truncate = false;

  return sequelize.continueTransaction(options, transaction => {
    return models.User.destroy({ where, ...options, transaction });
  });
};


module.exports = {
  fetchUsers,
  createUserWithDependencies,
  updateUser,
  deleteUser
};