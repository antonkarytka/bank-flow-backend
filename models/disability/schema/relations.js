module.exports = (Disability, models) => {
  Disability.hasMany(models.User, { as: 'users', foreignKey: { name: 'disabilityId', allowNull: true } });
};