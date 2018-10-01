module.exports = (BankAccount, models) => {
  BankAccount.belongsTo(models.User, { as: 'user', foreignKey: { name: 'userId', allowNull: false } });
};