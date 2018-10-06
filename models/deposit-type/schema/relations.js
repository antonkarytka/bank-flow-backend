module.exports = (DepositType, models) => {
  DepositType.hasMany(models.Deposit, { as: 'deposits', foreignKey: { name: 'depositTypeId', allowNull: false }});
};