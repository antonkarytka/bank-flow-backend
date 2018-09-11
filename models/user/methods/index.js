const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;


const createOneWithDependencies = (content, options = {}) => {
  return models.User.createOne(content, options)
};


module.exports = {
  createOneWithDependencies
};