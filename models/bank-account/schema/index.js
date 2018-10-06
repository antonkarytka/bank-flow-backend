const { DataTypes } = require('sequelize');
const { TABLE_NAME, ACTIVITY } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  number: { type: DataTypes.INTEGER, allowNull: false },
  numberCode: { type: DataTypes.INTEGER, allowNull: false },
  activity: { type: DataTypes.ENUM(Object.values(ACTIVITY)), allowNull: false },
  debit: { type: DataTypes.DOUBLE, allowNull: false },
  credit: { type: DataTypes.DOUBLE, allowNull: false },
  remainder: { type: DataTypes.DOUBLE, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DOUBLE, allowNull: false }
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      unique: true,
      fields: ['number']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
