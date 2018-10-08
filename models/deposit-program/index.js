const { MODEL_NAME } = require('./constants');
const { DEFINITION_OBJECT, CONFIGURATION_OBJECT } = require('./schema');
const establishRelations = require('./schema/relations');

module.exports = sequelize => {
  const DepositProgram = sequelize.define(MODEL_NAME, DEFINITION_OBJECT, CONFIGURATION_OBJECT);

  DepositProgram.associate = models => establishRelations(DepositProgram, models);

  return DepositProgram;
};