const { DataTypes } = require('sequelize');
const { TABLE_NAME } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  number: { type: DataTypes.STRING, allowNull: false },
  pin: { type: DataTypes.STRING, allowNull: false }
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
