module.exports = (User, models) => {
  User.belongsTo(models.City, { as: 'city', foreignKey: { name: 'cityId', allowNull: false } });
  User.belongsTo(models.Citizenship, { as: 'citizenship', foreignKey: { name: 'citizenshipId', allowNull: false } });
  User.belongsTo(models.Disability, { as: 'disability', foreignKey: { name: 'disabilityId', allowNull: true } });
};