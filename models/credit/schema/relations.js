module.exports = (Credit, models) => {
  Credit.belongsTo(models.BankAccount, { as: 'rawBankAccount', foreignKey: { name: 'rawBankAccountId', allowNull: false } });
  Credit.belongsTo(models.BankAccount, { as: 'percentageBankAccount', foreignKey: { name: 'percentageBankAccountId', allowNull: false } });
  Credit.belongsTo(models.CreditProgram, { as: 'creditProgram', foreignKey: { name: 'creditProgramId', allowNull: false } });
};