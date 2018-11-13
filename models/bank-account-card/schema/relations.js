module.exports = (BankAccountCard, models) => {
  BankAccountCard.belongsTo(models.BankAccount, { as: 'bankAccount', foreignKey: { name: 'bankAccountId', allowNull: false } });
};