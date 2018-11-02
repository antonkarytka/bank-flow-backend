module.exports = (Deposit, models) => {
  Deposit.belongsTo(models.BankAccount, { as: 'rawBankAccount', foreignKey: { name: 'rawBankAccountId', allowNull: false } });
  Deposit.belongsTo(models.BankAccount, { as: 'percentageBankAccount', foreignKey: { name: 'percentageBankAccountId', allowNull: false } });
  Deposit.belongsTo(models.DepositProgram, { as: 'depositProgram', foreignKey: { name: 'depositProgramId', allowNull: false } });
};