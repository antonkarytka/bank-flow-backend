module.exports = (Deposit, models) => {
  Deposit.hasMany(models.BankAccount, { as: 'bankAccounts', foreignKey: { name: 'depositId', allowNull: false } });
  Deposit.belongsTo(models.DepositType, { as: 'depositType', foreignKey: { name: 'depositTypeId', allowNull: false } });
  Deposit.belongsTo(models.User, { as: 'user', foreignKey: { name: 'userId', allowNull: true } });
};