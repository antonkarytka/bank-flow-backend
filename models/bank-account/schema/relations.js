module.exports = (BankAccount, models) => {
  BankAccount.belongsTo(models.User, { as: 'user', foreignKey: { name: 'userId', allowNull: true } });
  BankAccount.hasOne(models.Deposit, { as: 'rawAccountDeposit', foreignKey: { name: 'rawBankAccountId', allowNull: false }});
  BankAccount.hasOne(models.Deposit, { as: 'percentageAccountDeposit', foreignKey: { name: 'percentageBankAccountId', allowNull: false }});
  BankAccount.hasMany(models.Transition, { as: 'receivedTransitions', foreignKey: { name: 'receiverBankAccountId', allowNull: false }});
  BankAccount.hasMany(models.Transition, { as: 'sentTransitions', foreignKey: { name: 'senderBankAccountId', allowNull: false }});
};