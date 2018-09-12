const Promise = require('bluebird');

const models = require('../../index');


const fetchUsers = (where = {}, options = {}) => {
  /**
   * List Users using `User.fetch()` method. Provide needed `includes` to
   * this method's second parameter.
   */
};

const createUserWithDependencies = (content, options = {}) => {
  /**
   * Upsert provided City, Citizenship and Disability to corresponding tables,
   * get newly created entries' primary keys. Only then create a User entry.
   */
};

const updateUser = (where, content, options = {}) => {
  /**
   * Update User entry and provided City, Citizenship and Disability using `User.updateOne()`.
   */
};

const deleteUser = (where, options = {}) => {
  /**
   * Delete User entry by its id.
   */
};


module.exports = {
  fetchUsers,
  createUserWithDependencies,
  updateUser,
  deleteUser
};