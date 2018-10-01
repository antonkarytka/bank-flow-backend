module.exports = (Deposit, models) => {
  Deposit.belongsTo(models.User, { as: 'borrower', foreignKey: { name: 'borrowerUserId', allowNull: false } });
  Deposit.belongsTo(models.User, { as: 'receiver', foreignKey: { name: 'receiverUserId', allowNull: false } });
};