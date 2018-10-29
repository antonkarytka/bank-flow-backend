const { DataTypes } = require('sequelize');
const { TABLE_NAME, OPERATION } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  contractNumber: { type: DataTypes.STRING, allowNull: false },
  dailyPercentChargeAmount: { type: DataTypes.DOUBLE, allowNull: false },
  latestOperation: { type: DataTypes.ENUM(Object.values(OPERATION)), allowNull: true }
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      unique: true,
      fields: ['contractNumber']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
