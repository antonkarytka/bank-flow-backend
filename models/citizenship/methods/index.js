const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;

const fetchCitizenships = (where = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Citizenship.fetch(where, { ...options, transaction });
  });
};


module.exports = {
  fetchCitizenships
};