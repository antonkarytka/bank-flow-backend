module.exports = (Deposit, models) => {
  Deposit.belongsTo(models.BankAccount, { as: 'borrowerBankAccount', foreignKey: { name: 'borrowerBankAccountId', allowNull: false } });
  Deposit.belongsTo(models.BankAccount, { as: 'receiverBankAccount', foreignKey: { name: 'receiverBankAccountId', allowNull: false } });
};