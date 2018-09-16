const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchUsers = (where = {}, options = {}) => {
  /**
   * List Users using `User.fetch()` method. Provide needed `includes` to
   * this method's second parameter.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.User.fetch(where, {
      include: [
        { model: models.City, as: 'city'},
        { model: models.Citizenship, as: 'citizenship'},
        { model: models.Disability, as: 'disability'},
      ]
    })
    .then(users => ({data: users}));
  });
};

const createUserWithDependencies = (content, options = {}) => {
  /**
   * Upsert provided City, Citizenship and Disability to corresponding tables,
   * get newly created entries' primary keys. Only then create a User entry.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.User.createOne(content, options)
        .tap(user => user.setCity(content.cityId, {transaction, individualHooks: true}))
        .tap(user => user.setCitizenship(content.citizenshipId, {transaction, individualHooks: true}))
        .tap(user => user.setDisability(content.disabilityId, {transaction, individualHooks: true}));
  });
};

const updateUser = (where, content, options = {}) => {
  /**
   * Update User entry and provided City, Citizenship and Disability using `User.updateOne()`.
   */
  return sequelize.continueTransaction(options, transaction => {
    return models.User.updateOne(where, content, options)
      .then(user => user);
  });
};

const deleteUser = (where, options = {}) => {
  /**
   * Delete User entry by its id.
   */
  options.truncate = false;
  return sequelize.continueTransaction(options, transaction => {
    return models.User.destroy({where, options});
  });
};


module.exports = {
  fetchUsers,
  createUserWithDependencies,
  updateUser,
  deleteUser
};