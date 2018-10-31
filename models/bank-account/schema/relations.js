module.exports = (BankAccount, models) => {
  BankAccount.belongsTo(models.User, { as: 'user', foreignKey: { name: 'userId', allowNull: true } });
  BankAccount.belongsTo(models.Deposit, { as: 'deposit', foreignKey: { name: 'depositId', allowNull: true }});
  BankAccount.hasMany(models.Transition, { as: 'receivedTransitions', foreignKey: { name: 'receiverBankAccountId', allowNull: false }});
  BankAccount.hasMany(models.Transition, { as: 'sentTransitions', foreignKey: { name: 'senderBankAccountId', allowNull: false }});
};