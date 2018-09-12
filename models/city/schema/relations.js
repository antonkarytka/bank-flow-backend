module.exports = (City, models) => {
  City.hasMany(models.User, { as: 'residents', foreignKey: { name: 'cityId', allowNull: false } });
};