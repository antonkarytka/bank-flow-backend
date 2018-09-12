module.exports = (Citizenship, models) => {
  Citizenship.hasMany(models.User, { as: 'residents', foreignKey: { name: 'citizenshipId', allowNull: false } });
};