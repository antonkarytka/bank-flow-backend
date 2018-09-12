const { MODEL_NAME } = require('./constants');
const { DEFINITION_OBJECT, CONFIGURATION_OBJECT } = require('./schema');
const establishRelations = require('./schema/relations');

module.exports = sequelize => {
  const City = sequelize.define(MODEL_NAME, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

  City.associate = models => establishRelations(City, models);

  return City;
};