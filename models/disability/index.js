const { MODEL_NAME } = require('./constants');
const { DEFINITION_OBJECT, CONFIGURATION_OBJECT } = require('./schema');
const establishRelations = require('./schema/relations');

module.exports = sequelize => {
  const Disability = sequelize.define(MODEL_NAME, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

  Disability.associate = models => establishRelations(Disability, models);

  return Disability;
};