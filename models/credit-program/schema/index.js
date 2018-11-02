const { DataTypes } = require('sequelize');
const { TABLE_NAME } = require('../constants');

const { CURRENCY, TYPE } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM(Object.values(TYPE)), allowNull: false },
  createdAt: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  endsAt: { type: DataTypes.DATEONLY, allowNull: true },
  currency: { type: DataTypes.ENUM(Object.values(CURRENCY)), allowNull: false },
  percent: { type: DataTypes.DOUBLE, allowNull: false },
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      fields: ['name']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
