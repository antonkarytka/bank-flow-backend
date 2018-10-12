const { DataTypes } = require('sequelize');
const { TABLE_NAME, ACTIVITY, ACCOUNT_TYPE } = require('../constants');
const { BALANCE_ACCOUNT_NUMBER } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  /**
   * What characters in account number mean:
   *
   * 1-4: balance account number (3012 - for commercial organizations)
   * 5-12: individual account number
   * 13: control key (generated depending on account number and weight coefficients using 0 for control key)
   */
  number: { type: DataTypes.INTEGER, allowNull: false },
  numberCode: { type: DataTypes.INTEGER, allowNull: false, defaultValue: BALANCE_ACCOUNT_NUMBER },
  activity: { type: DataTypes.ENUM(Object.values(ACTIVITY)), allowNull: false },
  debit: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
  credit: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
  remainder: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  accountType: { type: DataTypes.ENUM(Object.values(ACCOUNT_TYPE)), allowNull: false}
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
