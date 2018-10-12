module.exports = (BankAccount, models) => {
  BankAccount.belongsTo(models.User, { as: 'user', foreignKey: { name: 'userId', allowNull: false } });
  BankAccount.belongsTo(models.Deposit, { as: 'deposit', foreignKey: { name: 'depositId', allowNull: true }});
};