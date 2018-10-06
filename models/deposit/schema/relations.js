module.exports = (Deposit, models) => {
  Deposit.hasMany(models.BankAccount, { as: 'bankAccounts', foreignKey: { name: 'depositId', allowNull: false } });
  Deposit.belongsTo(models.DepositProgram, { as: 'depositProgram', foreignKey: { name: 'depositProgramId', allowNull: false } });
};