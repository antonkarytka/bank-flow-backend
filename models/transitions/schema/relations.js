module.exports = (Transition, models) => {
  Transition.belongsTo(models.BankAccount, { as: 'receiverBankAccount', foreignKey: { name: 'receiverBankAccountId', allowNull: true } });
  Transition.belongsTo(models.BankAccount, { as: 'senderBankAccount', foreignKey: { name: 'senderBankAccountId', allowNull: true } });
};