const { MODEL_NAME } = require('./constants');
const { DEFINITION_OBJECT, CONFIGURATION_OBJECT } = require('./schema');
const establishRelations = require('./schema/relations');

module.exports = sequelize => {
  const Citizenship = sequelize.define(MODEL_NAME, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

  Citizenship.associate = models => establishRelations(Citizenship, models);

  return Citizenship;
};