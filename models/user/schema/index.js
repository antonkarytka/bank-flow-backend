const { DataTypes } = require('sequelize');
const { TABLE_NAME } = require('../constants');

const { MARITAL_STATUS } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  patronymic: { type: DataTypes.STRING, allowNull: false },
  birthDate: { type: DataTypes.DATEONLY, allowNull: false },
  sex: { type: DataTypes.BOOLEAN, allowNull: false },
  passportSeries: { type: DataTypes.STRING, allowNull: false },
  passportNumber: { type: DataTypes.STRING, allowNull: false },
  issuedBy: { type: DataTypes.STRING, allowNull: false },
  issueDate: { type: DataTypes.DATEONLY, allowNull: false },
  identificationNumber: { type: DataTypes.DATEONLY, allowNull: false },
  homePhone: { type: DataTypes.STRING, allowNull: true },
  mobilePhone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  maritalStatus: { type: DataTypes.ENUM(Object.values(MARITAL_STATUS))},
  pensioner: { type: DataTypes.BOOLEAN, allowNull: false },
  salary: { type: DataTypes.INTEGER, allowNull: true },
  liableForMilitaryService: { type: DataTypes.BOOLEAN, allowNull: false }
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      unique: true,
      fields: ['firstName', 'lastName', 'patronymic']
    },
    {
      unique: true,
      fields: ['passportSeries', 'passportNumber']
    },
    {
      unique: true,
      fields: ['identificationNumber']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['mobilePhone']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};
