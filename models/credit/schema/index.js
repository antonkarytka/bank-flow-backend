const { DataTypes } = require('sequelize');
const { TABLE_NAME } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  residualAmount: { type: DataTypes.DOUBLE, allowNull: false },
  residualMonthlyPaymentAmount: { type: DataTypes.DOUBLE, allowNull: true },
  contractNumber: { type: DataTypes.STRING, allowNull: false },
  monthlyChargeAmount: { type: DataTypes.DOUBLE, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  endsAt: { type: DataTypes.DATE, allowNull: false },
  durationInMonths: { type: DataTypes.INTEGER, allowNull: false },
  creditBody: { type: DataTypes.DOUBLE, allowNull: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
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
