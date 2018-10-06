module.exports = (BankAccount, models) => {
  BankAccount.belongsTo(models.Deposit, { as: 'deposit', foreignKey: { name: 'depositId', allowNull: false } });
};