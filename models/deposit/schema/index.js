const { DataTypes } = require('sequelize');
const { TABLE_NAME, STATUS } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  contractNumber: { type: DataTypes.STRING, allowNull: false },
  dailyPercentChargeAmount: { type: DataTypes.DOUBLE, allowNull: false },
  status: { type: DataTypes.ENUM(Object.values(STATUS)), allowNull: false, defaultValue: STATUS.INITIAL }
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      unique: true,
      fields: ['contractNumber']
    },
    {
      fields: ['status']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
