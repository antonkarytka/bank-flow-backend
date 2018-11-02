module.exports = (CreditProgram, models) => {
  CreditProgram.hasMany(models.Credit, { as: 'credits', foreignKey: { name: 'creditProgramId', allowNull: false }});
};