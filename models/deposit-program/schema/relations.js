module.exports = (DepositProgram, models) => {
  DepositProgram.hasMany(models.Deposit, { as: 'deposits', foreignKey: { name: 'depositProgramId', allowNull: false }});
};